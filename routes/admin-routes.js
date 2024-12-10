const express = require("express");
const { checkLogin } = require("../middlewares/checkLogin");
const { checkIsAdmin } = require("../middlewares/checkIsAdmin");

const adminRoute = express.Router();

adminRoute.route("/").get(checkLogin, checkIsAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome to admin page", data: req.user });
});

module.exports = { adminRoute };
