// const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Image = model("Image", ImageSchema);
module.exports = { Image };
