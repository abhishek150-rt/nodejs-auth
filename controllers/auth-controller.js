const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const jwtSecretKey = process.env.JWT_SECRET;

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // check if user aready exist
    const userExist = await User.findOne({ $or: [{ username }, { email }] });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User already exist with same username or email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      res
        .status(200)
        .json({ message: "User Created Successfully", data: newUser });
    } else {
      res.status(400).json({ message: "Unable to register user" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials." });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.username,
        role: user.role,
      },
      jwtSecretKey,
      {
        expiresIn: "1hr",
      }
    );

    res.status(200).json({ message: "Login Success", data: token });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    
    const currUser = await User.findById(userId);

    if (!currUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "Password can not be same." });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, currUser.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      await bcrypt.genSalt(10)
    );

    currUser.password = hashedNewPassword;
    await currUser.save();
    res.status(200).json({ message: "Password changes succesfully",status:"success" });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
}

module.exports = { register, login, changePassword };
