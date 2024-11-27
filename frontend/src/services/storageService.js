import client from "../conf/appwriteClient";
import conf from "../conf/conf";
import { Storage, ID } from "appwrite";

export class StorageService {
  constructor() {
    this.bucket = new Storage(client);
  }

  // Upload a file to Appwrite storage
  async uploadFile(file) {
    if (!(file instanceof File)) {
      throw new Error("Invalid file type.");
    }

    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Appwrite service :: uploadFile() :: ", error);
      throw new Error("Failed to upload file."); // Throwing an error
    }
  }

  // Delete a file from Appwrite storage
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true; // Indicate success
    } catch (error) {
      console.error("Appwrite service :: deleteFile() :: ", error);
      throw new Error("Failed to delete file."); // Throwing an error
    }
  }

  // Get a preview of a file
  async getFilePreview(fileId) {
    if (!fileId) {
      throw new Error("File ID is required.");
    }

    try {
      const result = await this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        1800, // width; will be resized using this value.
        0, // height; ignored when 0
        "center", // crop center
        "90", // slight compression
        5, // border width
        "CDCA30", // border color
        15, // border radius
        1, // full opacity
        0, // no rotation
        "FFFFFF", // background color
        "jpg" // output jpg format
      );

      return result; // Return the URL for the image preview
    } catch (error) {
      console.error("Error fetching file preview:", error);
      throw new Error("Failed to fetch file preview."); // Rethrow with context
    }
  }
}

const storageService = new StorageService();
export default storageService;
