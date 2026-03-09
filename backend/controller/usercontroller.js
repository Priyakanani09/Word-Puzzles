const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.loginUser = async (req,res) => {
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message : "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message : "Invalid Password"});
    }

    const token = jwt.sign(
      {id: user._id,email : user.email},
      process.env.JWT_SECRET,
      { expiresIn: "10d"}
    );

    res.status(200).json({ message: "Login successful",token,user});
  }
  catch(err){
    res.status(500).json({ message: err.message});
  }
}