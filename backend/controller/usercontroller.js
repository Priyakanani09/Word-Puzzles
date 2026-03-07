const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.registeruser = async (req,res) => {
  try {
    const {name,email,password} = req.body;
    const userExits = await User.findOne({email});
    if (userExits) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  }
  catch (err) {
    res.status(500).json({ message: err.message});
  }
}