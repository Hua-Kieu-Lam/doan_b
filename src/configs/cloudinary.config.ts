const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME as string;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY as string;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET as string;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "ProHome",
  },
});

const uploadCloud = multer({ storage });

export default uploadCloud;
