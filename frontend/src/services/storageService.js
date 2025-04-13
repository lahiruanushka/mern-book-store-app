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

    return `https://cloud.appwrite.io/v1/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}&mode=admin`;
  }
}

const storageService = new StorageService();
export default storageService;
