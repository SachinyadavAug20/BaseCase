import mongoose, { Mongoose } from "mongoose";
import logger from "./logger";
import "@/dataBase"; // pre-load models

const MONGODB_URL = process.env.MONGODB_URI as string;

if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined");

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const dbConnect = async () : Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using Mongoose cached connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        dbName: "devflow",
      })
      .then((r) => {
        logger.info("Connected to mongoDB");
        return r;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        throw error;

      });
  }
  cached.conn=await cached.promise;
  return cached.conn;
}

export default dbConnect
