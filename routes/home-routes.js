const express = require("express");
const { checkLogin } = require("../middlewares/checkLogin");

const homeRoute = express.Router();

homeRoute.route("/").get(checkLogin, (req, res) => {
  res.status(200).json({ message: "Welcome to home page", data: req.user });
});

module.exports = { homeRoute };
