const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User registration
exports.register = async (req, res) => {
  const { name, email, password, role, specialty} = req.body;
  try {
    // Hash password before saving
    if (role === "doctor" && !specialty) {
      return res.status(400).json({ message: "Specialty is required for doctors" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, specialty });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (role !== "doctor" && role !== "patient") {
      return res.status(400).json({ message: "Invalid role." });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    console.log("JWT_SECRET used for signing:", process.env.JWT_SECRET);
    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // This must match
      { expiresIn: "1h" }
    );
    
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
    res.status(500).json({ error: error.message });
  }
};
