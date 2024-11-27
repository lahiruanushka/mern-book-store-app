import { Client } from "appwrite";
import conf from "./conf";

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

export default client;
