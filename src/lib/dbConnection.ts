import mongoose from "mongoose";
import config from "../config.js";
const connectToDb = async () => {
  try {
    if (!config.mongodb.url) {
      throw new Error("MONGODB_URL is not set");
    }
    await mongoose.connect(config.mongodb.url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to Mongoose:", error);
    process.exit(1);
  }
};

export default connectToDb;
