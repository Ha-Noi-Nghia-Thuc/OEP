import express, { Router } from "express";
import { getCourse, listCourses } from "../controllers/course.controller";

const router = Router();

router.get("/", listCourses);
router.get("/:courseId", getCourse);

export default router;
