import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const signup = async (req, res) => {
    console.log("Signup Payload:", req.body);

  try {
    const { name, email, password, role } = req.body;
     console.log({ name, email, password, role }); 

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    if (!/^[A-Za-z ]{3,}$/.test(name)) {
      return res.status(400).json({ message: "Name must be at least 3 letters and only alphabets allowed", success: false });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format", success: false });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be 8+ chars with upper, lower, number & special char", success: false });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      if (!existingUser.is_verified) {
        await UserModel.deleteOne({ _id: existingUser._id });
      } else {
        return res.status(409).json({ message: "User already exists", success: false });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      is_active: true,
      is_verified: false,
      otp,
    });

    await newUser.save();

    await sendEmail(
      email,
      "Man Power Demographics - Email Verification OTP",
      `Hello ${name},\n\nYour OTP is: ${otp}\n\nPlease enter this to verify your account.`
    );

    return res.status(201).json({ message: "Signup successful. OTP sent to email.", success: true });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "Auth failed: email or password wrong", success: false });
    }

    if (user.otp != otp) {
      return res.status(403).json({ message: "OTP is wrong", success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.is_verified = true;
    await user.save();

    res.status(200).json({
      message: "OTP has been verified",
      name: user.name,
      email: user.email,
      role: user.role,
      jwtToken,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If a matching account was found, an OTP has been sent.",
        success: true,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(
      email,
      "Man Power Demographics by HR Department - Password Reset OTP",
      `Hello ${user.name || "User"},

        We received a request to reset your password.
        
        🔐 Your One-Time Password (OTP) is: ${otp}
        
        Please enter this OTP in the app to proceed with resetting your password. Do not share this code with anyone. It will expire shortly.
        If you did not request this, please ignore this email.
        
        Regards,  
        Master Motor Support Team`
    );
    
    return res.status(200).json({
      message: "If a matching account was found, an OTP has been sent.",
      success: true,
    });

  } catch (error) {
    console.error("Forget Password Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must be 8+ chars with upper, lower, number & special char", success: false });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined; 
    await user.save();

    res.status(200).json({
      message: "Password reset successfully. Please log in.",
      success: true,
    });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required", success: false });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email", success: false });
    }

    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    res.status(200).json({ message: "OTP verified successfully", success: true });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};