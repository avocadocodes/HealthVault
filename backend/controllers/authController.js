
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password !== user.password) // Simplified for demo purposes
      return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
        expiresIn: "1h",
      });
      

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
                