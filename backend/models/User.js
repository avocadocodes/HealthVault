
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["doctor", "admin", "patient"], required: true },
  specialty: {
    type: String,
    required: function () {
      return this.role === "doctor"; 
    },
  },
}, { timestamps: true });


userSchema.methods.validatePassword =async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.getAccessToken =async function(){
  return await jwt.sign({
      email:this.email,
      id:this._id
  },process.env.JWT_SECRET,{expiresIn:"15 days"})
}
module.exports = mongoose.model("User", userSchema);
                