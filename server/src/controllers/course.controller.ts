import { Request, Response } from "express";
import Course from "../models/course.model";
import mongoose, { PipelineStage } from "mongoose";
import Enrollment from "../models/enrollment.model";
import Section from "../models/section.model";
import Chapter from "../models/chapter.model";

export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;

  try {
    const pipeline: PipelineStage[] = [];

    // 1. Stage $match: Lọc theo category nếu có
    let matchQuery = {};
    if (category && typeof category === "string" && category !== "all") {
      matchQuery = { category: category };
      console.log(`Filtering courses by category: ${category}`);

      pipeline.push({ $match: matchQuery });
    } else {
      console.log("Retrieving all courses.");
    }

    // 2. Stage $lookup: Join với collection 'enrollments'
    pipeline.push({
      $lookup: {
        from: Enrollment.collection.collectionName,
        localField: "_id",
        foreignField: "courseId",
        as: "enrollmentData",
      },
    });

    // 3. Stage $addFields: Thêm trường enrollmentCount
    pipeline.push({
      $addFields: {
        // Đếm số lượng phần tử trong mảng enrollmentData
        enrollmentCount: { $size: "$enrollmentData" },
      },
    });

    // 4. Stage $project: Loại bỏ trường tạm thời enrollmentData
    pipeline.push({
      $project: {
        enrollmentData: 0, // 0 có nghĩa là loại bỏ trường này
      },
    });

    // --- Thực thi Aggregation Pipeline ---
    console.log("Executing aggregation pipeline:", JSON.stringify(pipeline)); // Log pipeline để debug
    const courses = await Course.aggregate(pipeline);
    console.log(`Found ${courses.length} courses.`);

    res
      .status(200)
      .json({ message: "Courses retrieved successfully", data: courses });
  } catch (error: any) {
    console.error(`Error retrieving courses:`, error);
    res.status(500).json({
      message: "Error retrieving courses",
      error: error.message || "Internal server error",
    });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid Course ID format" });
      return;
    }

    const course = await Course.findById(courseId)
      .populate<{
        sections: Array<
          InstanceType<typeof Section> & {
            chapters: InstanceType<typeof Chapter>[];
          }
        >;
      }>({
        path: "sections",
        options: { sort: { order: 1 } },
        populate: {
          path: "chapters",
          model: Chapter,
          options: { sort: { order: 1 } },
        },
      })
      .lean();
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const enrollmentCount = await Enrollment.countDocuments({
      courseId: course._id,
    });

    const courseResult = {
      ...course,
      enrollmentCount,
    };

    res
      .status(200)
      .json({ message: "Course retrieved successfully", data: courseResult });
  } catch (error: any) {
    console.error(`Error retrieving course ${courseId}:`, error); // Log lỗi đầy đủ ở server
    res.status(500).json({
      message: "Error retrieving course",
      error: error.message || "Internal server error",
    });
  }
};
