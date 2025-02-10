const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redisClient= require("../utils/redisClient")
const generateEmail= require("../utils/sendEmail")
const createOTP= require("../utils/createOTP.js")

const tokenTime=2

const verifyOTP= async function (enteredOtp,email){
  const otp=await redisClient.get(email)

  if(otp!=enteredOtp)throw Error("Wrong OTP")
  return ;
}
exports.register = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;
  try {
    if (role === "doctor" && !specialty) {
      return res.status(400).json({ message: "Specialty is required for doctors" });
    }
    const token = createOTP()
    const otp=await generateEmail(name,email,token,tokenTime)
    await redisClient.set(email,token,'EX',tokenTime*60)
    console.log(otp);
    res.json({message:`Email sent to ${email} , please verify the token`})
 
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verify= async (req,res)=>{
    try {
      const {name, email, password, role, specialty,enteredOtp}=req.body
      await verifyOTP(enteredOtp,email)
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role, specialty });
      await user.save();
      console.log(user)
      await redisClient.del(email);
      res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
      console.log(error)
      res.json({error:error.message}).status(404)
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt for email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "doctor" && user.role !== "patient") {
      console.error("Invalid role for user:", user.role);
      return res.status(400).json({ message: "Invalid role." });
    }

    const validated=await user.validatePassword(password);
    if(!validated)throw Error("Invalid credentials")
    console.log("JWT_SECRET used for signing:", process.env.JWT_SECRET);
    const token=await user.getAccessToken()
    console.log("Login successful, token generated for:", email);
    res.status(200).cookie("token",token,{
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      sameSite:"lax",
      secure:process.env.NODE_ENV === "production"
      }).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.forgotpassoword=async (req,res)=>{
  const {email,name}=req.body
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({ message: "No such email exists" });
    }
    const token = createOTP()
    const otp=await generateEmail(name,email,token,tokenTime)
    await redisClient.set(email,token,'EX',tokenTime*60)
    console.log(otp);
    res.json({message:`Email sent to ${email} , please verify the token`})
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
}
exports.resetpassword=async(req,res)=>{
  const {email,enteredOtp,password}=req.body
  try {
    await verifyOTP(enteredOtp,email)
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({ message: "No such email exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await redisClient.del(email);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
}

exports.logout=async(req,res)=>{
  res.cookie("token",null,{expires: new Date(Date.now())}).json({message:"logout successful"})
}
