import mongoose, { Schema, model } from "mongoose";

const chapterProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi user chỉ có 1 bản ghi tiến độ cho mỗi chapter
chapterProgressSchema.index({ userId: 1, chapterId: 1 }, { unique: true });
// Tối ưu truy vấn lấy tất cả tiến độ của user trong course
chapterProgressSchema.index({ userId: 1, courseId: 1 });

const ChapterProgress = model("ChapterProgress", chapterProgressSchema);
export default ChapterProgress;
