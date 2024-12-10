const express = require("express");
const { register, login, changePassword } = require("../controllers/auth-controller");
const { checkLogin } = require("../middlewares/checkLogin");

const authRoute = express.Router();

authRoute.route("/register").post(register);
authRoute.route("/login").post(login);
authRoute.route("/changePassword").post(checkLogin, changePassword);

module.exports = { authRoute };
