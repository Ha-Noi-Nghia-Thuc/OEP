import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Published"],
      default: "Draft",
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
  },
  { timestamps: true }
);

// Index cho các trường hay được tìm kiếm/lọc
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ creatorId: 1 });

const Course = model("Course", courseSchema);
export default Course;
