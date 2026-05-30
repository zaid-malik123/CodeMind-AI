import cloudinary from "../config/upload.cloudinary.js";
import fs from "fs/promises"

export const uploadOnCloud = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "codeminidai",
    });

    fs.unlink(file.path);
    return result.secure_url; 
  } catch (error) {
    fs.unlink(file.path);
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export const deleteFromCloud = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};