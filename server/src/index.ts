import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as mongoose from "mongoose";

import "./models/user.model";
import "./models/course.model";
import "./models/section.model";
import "./models/chapter.model";
import "./models/enrollment.model";
import "./models/comment.model";
import "./models/chapter-progress.model";

// ROUTE IMPORTS
import courseRoutes from "./routes/course.route";

// CONFIGURATIONS
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use("/courses", courseRoutes);

// Kiểm tra MONGO_URL
if (!MONGO_URL) {
  console.error("FATAL ERROR: MONGO_URL is not defined.");
  process.exit(1); // Thoát nếu không có URL MongoDB
}

// Kết nối MongoDB TRƯỚC KHI khởi động server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
