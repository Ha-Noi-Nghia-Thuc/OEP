import mongoose, { model, Schema } from "mongoose";

const chapterSchema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Text", "Quiz", "Video"],
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    quizQuestions: [
      {
        questionText: String,
        options: [String],
        correctAnswerIndex: Number,
      },
    ],
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Chapter = model("Chapter", chapterSchema);
export default Chapter;
