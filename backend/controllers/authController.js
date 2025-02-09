const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redisClient= require("../utils/redisClient")
const generateEmail= require("../utils/sendEmail")
const createOTP= require("../utils/createOTP.js")

const tokenTime=2


exports.register = async (req, res) => {
  const { name, email, password, role, specialty } = req.body;
  try {
    // Check for doctor's specialty
    if (role === "doctor" && !specialty) {
      return res.status(400).json({ message: "Specialty is required for doctors" });
    }
    const token = createOTP()
    const otp=await generateEmail(name,email,token,tokenTime)
    await redisClient.set(email,token,'EX',tokenTime*60)
    console.log(otp);
    res.json({message:`Email sent to ${email} , please verify the token`})
    // Hash password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new User({ name, email, password: hashedPassword, role, specialty });
    // await user.save();

    // res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.verify= async (req,res)=>{
    try {
      const {name, email, password, role, specialty,enteredToken}=req.body
      const otp=await redisClient.get(email)

      if(otp!=enteredToken)res.status(401).json({message:"Wrong token"})
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role, specialty });
      await user.save();
  
      res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
      console.log(error)
      res.json({error:error.message})
  }
}
// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt for email:", email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    // Validate role
    if (user.role !== "doctor" && user.role !== "patient") {
      console.error("Invalid role for user:", user.role);
      return res.status(400).json({ message: "Invalid role." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid credentials for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("JWT_SECRET used for signing:", process.env.JWT_SECRET);

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated for:", email);

    // Send token and user details
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};
