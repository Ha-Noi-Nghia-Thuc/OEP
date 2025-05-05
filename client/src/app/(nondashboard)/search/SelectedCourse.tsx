import AccordionSections from "@/components/AccordionSections";
import { Button } from "@/components/ui/button";
import React from "react";

const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{course.title}</h3>
        <p className="selected-course__author">
          Tác giả: {course.creatorName} |{" "}
          <span className="selected-course__enrollment-count">
            {typeof course.enrollmentCount === "number" &&
            course.enrollmentCount >= 0
              ? `${course.enrollmentCount} học viên`
              : ""}
          </span>
        </p>
      </div>

      <div className="selected-course__content">
        <p className="selected-course__description">{course.description}</p>
        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Nội dung khóa học</h4>
          {course.sections && course.sections.length > 0 ? (
            <AccordionSections sections={course.sections} />
          ) : (
            <p className="text-gray-500 text-sm">
              Nội dung khóa học chưa được cập nhật.
            </p>
          )}
        </div>

        <div className="selected-course__footer">
          <Button
            onClick={() => handleEnrollNow(course._id)}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
