import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dktiq3noj",
  api_key: "537197685959596",
  api_secret: "-LIZEAMPYwKMbmq4VWkP20pYKdU",
});

const uploadOnCloudinar = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // upload the file on cloudinary--
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has beeen uploaded on cloudinary
    return response;
  } catch (e) {
    // delete the file from local storage
    fs.unlinkSync(localFilePath); // delete the file from local storage
    return null;
  }
};
