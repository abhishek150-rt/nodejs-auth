require("dotenv").config();
const express = require("express");
const nodemailer = require('nodemailer');
const { connectDB } = require("./database/db");
const { authRoute } = require("./routes/auth-routes");
const { homeRoute } = require("./routes/home-routes");
const { adminRoute } = require("./routes/admin-routes");
const { fileRoute } = require("./routes/file-routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abhisheknegi969@gmail.com',  // Your Gmail address
    pass: 'loveurself',   // Your Gmail app password or actual password (see note below)
  },
});

app.use("/api/auth", authRoute);

app.use("/api/home", homeRoute);
app.use("/api/admin", adminRoute);
app.use("/api/file", fileRoute);

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;  // Get the user's email

  try {
    // Generate OTP
    const otp = 12345;

    // Setup email data
    const mailOptions = {
      from: 'abhishek.negi@rapidsoft.co.in',  // Sender address
      to: email,                    // Receiver email
      subject: 'Your OTP for Password Reset', // Email subject
      text: `Your OTP for password reset is: ${otp}`, // Email body (OTP message)
    };

    // Send email with OTP
    await transporter.sendMail(mailOptions);

    // Store OTP in database for verification (Optional, depending on your use case)
    // For example, save OTP in a database with an expiration time

    res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => console.log("Err", err));
