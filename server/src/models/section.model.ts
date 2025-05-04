import mongoose, { model, Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
  },
  { timestamps: true }
);

// Index kết hợp nếu bạn thường tìm section theo course và thứ tự
sectionSchema.index({ courseId: 1, order: 1 });

const Section = model("Section", sectionSchema);
export default Section;
