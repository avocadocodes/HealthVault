const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req,res,next)=>{
  try {
      const {token} =req.cookies
      console.log(token)
      if(!token)throw Error("Please login")
      const decodedUser=jwt.verify(token,process.env.JWT_SECRET)
      const {id} =decodedUser
      if(!id) throw Error("Invalid token, try logging in again")
      const user=await User.findById(id)
      if(!user) throw("invalid token")
      console.log(user)
      req.user=user
      next()
  } catch (error) {
      res.status(401).json({error:error.message})
  }
}
module.exports = authMiddleware;