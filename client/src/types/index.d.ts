// types/index.d.ts

// Import các kiểu cơ bản nếu cần (ví dụ: từ React cho ReactNode, nhưng ta sẽ bỏ qua props component)
// import { ReactNode } from 'react';

declare global {
  // --- Định nghĩa các Model Dữ liệu chính ---

  // Định nghĩa cấu trúc cho một câu hỏi Quiz trong Chapter
  interface QuizQuestion {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    _id?: string; // ID phụ nếu cần trong mảng con
  }

  // Định nghĩa cho User (Đơn giản hóa từ schema User)
  interface User {
    _id: string; // MongoDB ObjectId dưới dạng chuỗi
    name: string;
    email: string;
    role: "student" | "teacher" | "admin"; // Dựa trên schema User
    // Các trường khác từ schema User có thể thêm vào nếu cần gửi cho frontend
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho Chapter (Dựa trên schema Chapter)
  interface Chapter {
    _id: string;
    sectionId: string; // ObjectId của Section chứa chapter này
    title: string;
    type: "Text" | "Quiz" | "Video";
    content?: string | any; // Kiểu Mixed, có thể là text hoặc cấu trúc Quiz
    videoUrl?: string; // URL video nếu type là 'Video'
    quizQuestions?: QuizQuestion[]; // Mảng câu hỏi nếu type là 'Quiz'
    order: number; // Thứ tự chapter trong section
    // Các trường khác có thể thêm nếu cần
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho Section (Dựa trên schema Section)
  interface Section {
    _id: string;
    courseId: string; // ObjectId của Course chứa section này
    title: string;
    description?: string;
    order: number; // Thứ tự section trong course
    chapters: Chapter[]; // Mảng các ObjectId (dạng chuỗi) của Chapter
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho Course (Dựa trên schema Course)
  interface Course {
    _id: string;
    creatorId: string; // ObjectId của User tạo khóa học
    creatorName: string; // Tên người tạo (denormalized)
    title: string;
    description?: string;
    category: string;
    imageUrl?: string;
    status: "Draft" | "Published";
    sections: Section[]; // Mảng các ObjectId (dạng chuỗi) của Section
    enrollmentCount?: number;
    // Không có price, level
    // Không nhúng enrollments trực tiếp
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho Comment (Dựa trên schema Comment)
  interface Comment {
    _id: string;
    userId: string; // ObjectId của User viết comment
    chapterId: string; // ObjectId của Chapter mà comment thuộc về
    text: string;
    // Thông tin user có thể được populate từ backend trước khi gửi
    user?: {
      _id: string;
      name: string;
      // avatarUrl?: string; // Ví dụ
    };
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho Enrollment (Dựa trên schema Enrollment)
  interface Enrollment {
    _id: string;
    userId: string; // ObjectId của User đăng ký
    courseId: string; // ObjectId của Course được đăng ký
    enrolledAt: string; // ISO Date string
    lastAccessedAt?: string; // ISO Date string
    overallProgressPercent?: number; // Phần trăm tiến độ (0-100)
    completedAt?: string | null; // ISO Date string hoặc null nếu chưa hoàn thành
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // Định nghĩa cho ChapterProgress (Dựa trên schema ChapterProgress)
  interface ChapterProgress {
    _id: string;
    userId: string; // ObjectId của User
    courseId: string; // ObjectId của Course
    chapterId: string; // ObjectId của Chapter
    completed: boolean; // Trạng thái hoàn thành
    createdAt?: string; // ISO Date string
    updatedAt?: string; // ISO Date string
  }

  // --- Các kiểu tiện ích hoặc dùng chung khác (nếu cần) ---

  // Ví dụ: Kiểu cho phản hồi API chung
  interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string | object;
  }

  // Ví dụ: Kiểu DateRange nếu cần
  interface DateRange {
    from?: string; // ISO Date string
    to?: string; // ISO Date string
  }

  interface SearchCourseCardProps {
    course: Course;
    isSelected?: boolean;
    onClick?: () => void;
  }

  interface SelectedCourseProps {
    course: Course;
    handleEnrollNow: (courseId: string) => void;
  }

  interface AccordionSectionsProps {
    sections: Section[];
  }

  // Các kiểu cho Props của component React nên được định nghĩa ở frontend
  // Ví dụ:
  // interface CourseCardProps {
  //   course: Course; // Sử dụng lại kiểu Course ở trên
  //   // ... other props
  // }
}

// Thêm dòng này để đảm bảo file được coi là một module,
// tránh lỗi khi không có import/export nào khác.
export {};
