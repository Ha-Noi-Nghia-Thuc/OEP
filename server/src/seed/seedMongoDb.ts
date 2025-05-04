import dotenv from "dotenv";
import fs from "fs";
import mongoose, { Model } from "mongoose";
import path from "path";

import ChapterProgress from "../models/chapter-progress.model";
import Chapter from "../models/chapter.model";
import Comment from "../models/comment.model";
import Course from "../models/course.model";
import Enrollment from "../models/enrollment.model";
import Section from "../models/section.model";
import User from "../models/user.model";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const DATA_PATH = path.join(__dirname, "data");

const connectDB = async () => {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined in the environment variables.");
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

const cleanDatabase = async (models: Model<any>[]) => {
  console.log("Cleaning database...");
  try {
    for (const model of models) {
      const collectionName = model.collection.collectionName;
      console.log(`Dropping collection: ${collectionName}`);

      try {
        await mongoose.connection.db?.dropCollection(collectionName);
        console.log(`Collection ${collectionName} dropped.`);
      } catch (error: any) {
        if (error.code === 26 || error.message.includes("ns not found")) {
          console.log(
            `  Collection ${collectionName} does not exist, skipping.`
          );
        } else {
          throw error;
        }
      }
    }
    console.log("Database cleaned.");
  } catch (error) {
    console.error("Error cleaning database:", error);
    throw error;
  }
};

const parseEJSON = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => parseEJSON(item));
  } else if (data !== null && typeof data == "object") {
    if (data["$oid"] && typeof data["$oid"] === "string") {
      return new mongoose.Types.ObjectId(data["$oid"]);
    }
    if (data["$date"] && typeof data["$date"] === "string") {
      return new Date(data["$date"]);
    }

    const newObj: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key] = parseEJSON(data[key]);
      }
    }

    return newObj;
  }
  return data;
};

const seedCollection = async (model: Model<any>, fileName: string) => {
  const filePath = path.join(DATA_PATH, `${fileName}.json`);
  const collectionName = model.collection.collectionName;

  console.log(
    `\nSeeding collection: ${collectionName} from file: ${fileName}.json`
  );

  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`  Warning: Seed file not found at ${filePath}. Skipping.`);
      return;
    }

    const jsonData = fs.readFileSync(filePath, "utf-8");
    const rawData = JSON.parse(jsonData);

    // Chuyển đổi EJSON trước khi chèn
    const parsedData = parseEJSON(rawData);
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log(`  No data to seed for ${collectionName}.`);
      return;
    }

    // Sử dụng insertMany để hiệu quả hơn
    const result = await model.insertMany(parsedData, { ordered: false }); // ordered: false để tiếp tục nếu có lỗi ở 1 document
    console.log(
      `  Successfully seeded ${result.length} documents into ${collectionName}.`
    );
  } catch (error: any) {
    console.error(`  Error seeding ${collectionName}:`, error.message);
    if (error.code === 11000) {
      console.error("  Details: Duplicate key error.");
    } else if (error.name === "ValidationError") {
      console.error("  Details: Validation Error -", error.errors);
    }
  }
};

const seed = async () => {
  try {
    await connectDB();

    // Danh sách các model theo đúng thứ tự phụ thuộc để seed
    const modelsInOrder = [
      { model: User, file: "users" },
      { model: Course, file: "courses" },
      { model: Section, file: "sections" },
      { model: Chapter, file: "chapters" },
      { model: Enrollment, file: "enrollments" },
      { model: Comment, file: "comments" },
      { model: ChapterProgress, file: "chapterprogress" },
    ];

    // Xóa dữ liệu cũ
    await cleanDatabase(modelsInOrder.map((m) => m.model));

    // Seed dữ liệu theo thứ tự
    for (const item of modelsInOrder) {
      await seedCollection(item.model, item.file);
    }

    console.log(
      "\n\x1b[32m%s\x1b[0m",
      "Database seeding completed successfully!"
    );
  } catch (error) {
    console.error("\n\x1b[31m%s\x1b[0m", "Database seeding failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
};

// Chạy hàm seed nếu file này được thực thi trực tiếp
if (require.main === module) {
  seed();
}
