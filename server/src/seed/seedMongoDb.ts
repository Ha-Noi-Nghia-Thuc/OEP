import dotenv from "dotenv";
import fs from "fs";
import mongoose, { Model, Types } from "mongoose";
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
      return [];
    }

    const jsonData = fs.readFileSync(filePath, "utf-8");
    if (!jsonData.trim()) {
      console.log(`  Seed file ${fileName}.json is empty. Skipping.`);
      return [];
    }
    const rawData = JSON.parse(jsonData);

    // Chuyển đổi EJSON trước khi chèn
    const parsedData = parseEJSON(rawData);
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.log(`  No data to seed for ${collectionName}.`);
      return [];
    }

    // Sử dụng insertMany để hiệu quả hơn
    const insertedDocs = await model.insertMany(parsedData, { ordered: false }); // ordered: false để tiếp tục nếu có lỗi ở 1 document
    console.log(
      `  Successfully seeded ${insertedDocs.length} documents into ${collectionName}.`
    );
    return insertedDocs;
  } catch (error: any) {
    console.error(`  Error seeding ${collectionName}:`, error.message);
    if (error.code === 11000) {
      console.error("  Details: Duplicate key error.");
    } else if (error.name === "ValidationError") {
      console.error(
        "  Details: Validation Error -",
        JSON.stringify(error.errors, null, 2)
      );
    }
    return [];
  }
};

const seed = async () => {
  const insertedData: { [key: string]: any[] } = {
    users: [],
    courses: [],
    sections: [],
    chapters: [],
    enrollments: [],
    comments: [],
    chapterProgress: [],
  };

  try {
    await connectDB();

    // Danh sách các model để xóa (giữ nguyên)
    const modelsToClean = [
      User,
      Course,
      Section,
      Chapter,
      Enrollment,
      Comment,
      ChapterProgress,
    ];
    await cleanDatabase(modelsToClean);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // --- Seed Data và Lưu Kết quả ---
    // Thứ tự seed vẫn rất quan trọng
    insertedData.users = await seedCollection(User, "users");
    insertedData.courses = await seedCollection(Course, "courses");
    insertedData.sections = await seedCollection(Section, "sections");
    insertedData.chapters = await seedCollection(Chapter, "chapters");
    insertedData.enrollments = await seedCollection(Enrollment, "enrollments");
    insertedData.comments = await seedCollection(Comment, "comments");
    insertedData.chapterProgress = await seedCollection(
      ChapterProgress,
      "chapterprogress"
    );

    console.log("\nLinking related documents...");

    // 1. Liên kết Chapters vào Sections
    if (insertedData.chapters.length > 0 && insertedData.sections.length > 0) {
      console.log("  Linking chapters to sections...");
      const chaptersBySection = new Map<string, Types.ObjectId[]>();

      insertedData.chapters.sort((a, b) => a.order - b.order);

      for (const chapter of insertedData.chapters) {
        if (chapter.sectionId instanceof Types.ObjectId) {
          const sectionIdString = chapter.sectionId.toString();
          if (!chaptersBySection.has(sectionIdString)) {
            chaptersBySection.set(sectionIdString, []);
          }
          // *** SỬA LỖI TS(2322) Ở ĐÂY ***
          // Lấy ra mảng từ Map
          const chapterList = chaptersBySection.get(sectionIdString);
          // Kiểm tra tường minh xem mảng có tồn tại không trước khi push
          if (chapterList && chapter._id instanceof Types.ObjectId) {
            // <--- Kiểm tra chapterList !== undefined
            chapterList.push(chapter._id);
          }
          // *** KẾT THÚC SỬA LỖI ***
        }
      }

      // Cập nhật từng section
      for (const [sectionIdString, chapterIds] of chaptersBySection.entries()) {
        // ... (phần update không đổi) ...
        try {
          if (chapterIds.length > 0) {
            const sectionObjectId = new Types.ObjectId(sectionIdString);
            await Section.updateOne(
              { _id: sectionObjectId },
              { $set: { chapters: chapterIds } }
            );
            console.log(
              `    Linked ${chapterIds.length} chapters to Section ${sectionIdString}`
            );
          }
        } catch (linkError: any) {
          console.error(
            `    Error linking chapters to Section ${sectionIdString}:`,
            linkError.message
          );
        }
      }
      console.log("  Finished linking chapters to sections.");
    } else {
      console.log(
        "  Skipping chapter-section linking (no chapters or sections found)."
      );
    }

    // 2. Liên kết Sections vào Courses
    if (insertedData.sections.length > 0 && insertedData.courses.length > 0) {
      console.log("  Linking sections to courses...");
      const sectionsByCourse = new Map<string, Types.ObjectId[]>();

      insertedData.sections.sort((a, b) => a.order - b.order);

      for (const section of insertedData.sections) {
        if (section.courseId instanceof Types.ObjectId) {
          const courseIdString = section.courseId.toString();
          if (!sectionsByCourse.has(courseIdString)) {
            sectionsByCourse.set(courseIdString, []);
          }
          // *** SỬA LỖI TS(2322) TƯƠNG TỰ Ở ĐÂY ***
          // Lấy ra mảng từ Map
          const sectionList = sectionsByCourse.get(courseIdString);
          // Kiểm tra tường minh xem mảng có tồn tại không trước khi push
          if (sectionList && section._id instanceof Types.ObjectId) {
            // <--- Kiểm tra sectionList !== undefined
            sectionList.push(section._id);
          }
          // *** KẾT THÚC SỬA LỖI ***
        }
      }

      // Cập nhật từng course
      for (const [courseIdString, sectionIds] of sectionsByCourse.entries()) {
        // ... (phần update không đổi) ...
        try {
          if (sectionIds.length > 0) {
            const courseObjectId = new Types.ObjectId(courseIdString);
            await Course.updateOne(
              { _id: courseObjectId },
              { $set: { sections: sectionIds } }
            );
            console.log(
              `    Linked ${sectionIds.length} sections to Course ${courseIdString}`
            );
          }
        } catch (linkError: any) {
          console.error(
            `    Error linking sections to Course ${courseIdString}:`,
            linkError.message
          );
        }
      }
      console.log("  Finished linking sections to courses.");
    } else {
      console.log(
        "  Skipping section-course linking (no sections or courses found)."
      );
    }

    console.log(
      "\n\x1b[32m%s\x1b[0m", // Màu xanh lá
      "Database seeding and linking completed successfully!"
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
