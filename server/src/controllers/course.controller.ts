import { Request, Response } from "express";
import Course from "../models/course.model";

export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;

  try {
    let query = {};
    if (category && typeof category === "string" && category !== "all") {
      query = { category: category };
      console.log(`Filtering courses by category: ${category}`);
    } else {
      console.log("Retrieving all courses.");
    }

    const courses = await Course.find(query).lean();

    res
      .status(200)
      .json({ message: "Courses retrieved successfully", data: courses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Course retrieved successfully", data: course });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};
