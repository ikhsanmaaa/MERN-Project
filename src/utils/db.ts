import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

async function db() {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-mern",
    });
    return Promise.resolve("database connected!");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  } catch (error) {
    return Promise.reject(error);
  }
}

export default db;
