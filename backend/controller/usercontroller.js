const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registeruser = async (req,res) => {
  try {
    const {name,email,password,confirmPassword } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@#$%])[a-z\d@#$%]{1,12}$/i;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: [
          "Password must be at least 12 characters",
          "Include 1 uppercase letter (A–Z)",
          "Include lowercase letter (a–z)",
          "Include number (0–9)",
          "Include 1 special symbol (@ # $ %)",
        ],
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password do not match"
      });
    }

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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // ✅ RETURN TOKEN
    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
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

exports.getuser = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({ message: "Find Successfully", data });
  } catch (err) {
    res.status(400).json({ message: "user not find", error: err.message });
  }
};

exports.forgotpassword = async (req,res) => {
  try {
    const { email,newPassword } = req.body;
    if(!email || !newPassword){
      return res.status(400).json({ message: "Email and new password required" });
    } 

    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@#$%])[a-z\d@#$%]{1,12}$/i;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: [
          "Password must be at least 12 characters",
          "Include 1 uppercase letter (A–Z)",
          "Include lowercase letter (a–z)",
          "Include number (0–9)",
          "Include 1 special symbol (@ # $ %)",
        ],
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password = hashedPassword;
    await user.save();

     res.status(200).json({
      message: "Password reset successful. Please login with new password."
    });
  }
  catch(err){
     res.status(500).json({ message: "Forgot password failed", error });
  }
}