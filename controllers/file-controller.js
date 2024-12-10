const { uploadToCloudinary } = require("../helpers/cloudinary");
const { Image } = require("../models/image");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const { Mongoose, default: mongoose } = require("mongoose");

const getAllFiles = async (req, res) => {
  try {
    // Get page number and page size from the query params (defaults to page 1, page size 10 if not provided)
    const { pageNum = 1, pageSize = 10 } = req.query;

    // Ensure that pageNum and pageSize are numbers and valid
    const page = parseInt(pageNum);
    const size = parseInt(pageSize);

    if (page <= 0 || size <= 0) {
      return res.status(400).json({ message: "Page number and page size must be greater than 0" });
    }

    // Calculate the number of documents to skip (for pagination)
    const skip = (page - 1) * size;

    // Fetch the files with pagination
    const files = await Image.find({})
      .select("url -_id")
      .skip(skip)   // Skip the documents for the current page
      .limit(size); // Limit the number of documents per page

    // Optionally, you can also get the total count of documents in the database for pagination
    const totalFiles = await Image.countDocuments();

    res.status(200).json({
      message: "Success",
      data: files,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalFiles: totalFiles,
        totalPages: Math.ceil(totalFiles / size),
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};


const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { id, url } = await uploadToCloudinary(req.file.path);
    const newImage = new Image({
      url,
      publicId: id,
      uploadedBy: req.user.userId,
    });

    fs.unlinkSync(req.file.path);

    await newImage.save();
    res.status(201).json({
      message: "Image Upload successfully.",
      status: "success",
      image: url,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const imageId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: "Invalid image ID" });
    }

    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    const uploadedByCurrentUser =
      image.uploadedBy.toString() === userId ? true : false;

    if (!uploadedByCurrentUser) {
      return res
        .status(401)
        .json({ message: "Unautharized to delete the image" });
    }
    await cloudinary.uploader.destroy(image.publicId);

    await Image.findByIdAndDelete(imageId);

    res.status(200).json({ message: "File deleted succesfully" });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = { uploadFile, getAllFiles, deleteFile };
