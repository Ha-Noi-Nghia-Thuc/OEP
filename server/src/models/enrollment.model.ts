// models/Enrollment.js (New model replacing UserCourseProgress)
import mongoose, { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
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
    enrolledAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    overallProgressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo user chỉ đăng ký 1 khóa học 1 lần
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = model("Enrollment", enrollmentSchema);
export default Enrollment;
