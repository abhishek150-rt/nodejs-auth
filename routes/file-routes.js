const express = require("express");
const {
  uploadFile,
  getAllFiles,
  deleteFile,
} = require("../controllers/file-controller");
const { checkLogin } = require("../middlewares/checkLogin");
const { checkIsAdmin } = require("../middlewares/checkIsAdmin");
const uploadImage = require("../middlewares/upload-image");
const fileRoute = express.Router();

fileRoute
  .route("/upload")
  .post(checkLogin, checkIsAdmin, uploadImage.single("image"), uploadFile);
fileRoute.route("/getAll").get(checkLogin, getAllFiles);
fileRoute.route("/delete/:id").get(checkLogin, deleteFile);

module.exports = { fileRoute };
