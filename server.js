require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const { connectDB } = require("./database/db");
const { authRoute } = require("./routes/auth-routes");
const { homeRoute } = require("./routes/home-routes");
const { adminRoute } = require("./routes/admin-routes");
const { fileRoute } = require("./routes/file-routes");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abhisheknegi969@gmail.com", // Your Gmail address
    pass: "loveurself", // Your Gmail app password or actual password (see note below)
  },
});

app.use("/api/auth", authRoute);

app.use("/api/home", homeRoute);
app.use("/api/admin", adminRoute);
app.use("/api/file", fileRoute);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => console.log("Err", err));
