const pump = require("pump");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const emissorModel = require("../models/CompanyModel");

exports.uploadLogo = async (fileData) => {
  if (!fileData) {
    throw new Error("Arquivo não enviado");
  }

  const tempPath = path.join(__dirname, "../../tmp", fileData.filename);

  await pump(fileData.file, fs.createWriteStream(tempPath));

  const result = await cloudinary.uploader.upload(tempPath, {
    folder: "precifygo/logos",
  });

  fs.unlinkSync(tempPath);

  await emissorModel.updateLogo(result.secure_url);

  return result.secure_url;
};
