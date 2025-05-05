"use client";

import Loading from "@/components/Loading";
// Đảm bảo bạn đã import kiểu Course nếu dùng TypeScript
// import { Course } from "@/types";
import { useGetCourseQuery, useGetCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // Import Link để dùng trong thông báo không tìm thấy
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || undefined;
  const selectedIdFromUrl = searchParams.get("id");

  // --- State ---
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    selectedIdFromUrl // Khởi tạo state từ URL param nếu có
  );

  const selectedCourseRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  // Hook 1: Lấy danh sách khóa học (tóm tắt)
  const {
    data: coursesData,
    isLoading: isLoadingList,
    isError: isListError,
  } = useGetCoursesQuery({ category });

  // Hook 2: Lấy chi tiết khóa học được chọn (skip nếu chưa có ID)
  const {
    data: selectedCourseData,
    isLoading: isLoadingDetail,
    isError: isDetailError,
  } = useGetCourseQuery(selectedCourseId!, {
    skip: !selectedCourseId,
  });

  // --- Effects ---
  // useEffect để đồng bộ state selectedCourseId với URL và chọn mặc định
  useEffect(() => {
    // Trường hợp 1: URL có ID và nó khác với ID đang chọn trong state -> cập nhật state theo URL
    if (selectedIdFromUrl && selectedIdFromUrl !== selectedCourseId) {
      setSelectedCourseId(selectedIdFromUrl);
    }
    // Trường hợp 2: URL không có ID, danh sách đã tải xong, danh sách không rỗng, và chưa có course nào được chọn trong state -> chọn course đầu tiên làm mặc định
    else if (
      !selectedIdFromUrl &&
      !isLoadingList &&
      coursesData &&
      coursesData.length > 0 &&
      !selectedCourseId
    ) {
      setSelectedCourseId(coursesData[0]._id);
      // Không tự động cập nhật URL ở đây để tránh vòng lặp
    }
    // Trường hợp 3: Danh sách rỗng (và không loading) và URL không có ID -> đảm bảo không có course nào được chọn
    else if (
      !selectedIdFromUrl &&
      !isLoadingList &&
      coursesData &&
      coursesData.length === 0
    ) {
      setSelectedCourseId(null);
    }
  }, [selectedIdFromUrl, coursesData, isLoadingList, selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId && selectedCourseRef.current) {
      selectedCourseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedCourseId]);

  // --- Callbacks ---
  const handleCourseSelect = useCallback(
    (courseSummary: Course) => {
      if (courseSummary._id !== selectedCourseId) {
        setSelectedCourseId(courseSummary._id);
        const params = new URLSearchParams(searchParams.toString());
        params.set("id", courseSummary._id);
        router.push(`/search?${params.toString()}`, { scroll: false });
      }
    },
    [selectedCourseId, searchParams, router]
  );

  const handleEnrollNow = useCallback(
    (courseId: string) => {
      router.push(`/course?id=${courseId}&showSignUp=false`);
    },
    [router]
  );

  // 1. Xử lý trạng thái Loading chính
  if (isLoadingList) {
    return <Loading />;
  }

  // 2. Xử lý trạng thái Lỗi chính
  if (isListError || !coursesData) {
    return (
      <div className="p-4 text-center text-destructive">
        Lỗi khi tải danh sách khóa học. Vui lòng thử lại sau.
      </div>
    );
  }

  // 3. Xử lý trạng thái không tìm thấy khóa học
  if (coursesData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="search flex flex-col items-center text-center py-10 px-4"
      >
        <h1 className="search__title text-xl font-semibold mb-2">
          Không tìm thấy khóa học
        </h1>
        <p className="text-muted-foreground">
          {category
            ? `Rất tiếc, không có khóa học nào thuộc danh mục "${category}".`
            : "Rất tiếc, không có khóa học nào phù hợp."}
        </p>
        <p className="mt-1">
          Vui lòng thử lại với bộ lọc khác hoặc{" "}
          <Link
            href="/search"
            className="text-primary hover:underline"
            onClick={() => setSelectedCourseId(null)}
          >
            xem tất cả khóa học
          </Link>
          .
        </p>
      </motion.div>
    );
  }

  // 4. Render giao diện chính khi có dữ liệu
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search" // Đảm bảo class này có padding hoặc margin phù hợp
    >
      <h1 className="search__title">Khóa học</h1>
      {category && (
        <p className="text-sm text-muted-foreground mb-2">
          Danh mục: <span className="font-medium">{category}</span>
        </p>
      )}
      <h2 className="search__subtitle">
        {coursesData.length} khóa học được tìm thấy
      </h2>

      <div className="search__content flex flex-col lg:flex-row gap-6 lg:gap-8">
        {" "}
        {/* Container cho grid và selected */}
        {/* Grid danh sách khóa học */}
        <motion.div
          // ... animation ...
          className="search__courses-grid lg:w-2/3 lg:flex-shrink-0"
        >
          {coursesData.map((courseSummary) => (
            <CourseCardSearch
              key={courseSummary._id}
              course={courseSummary}
              isSelected={selectedCourseId === courseSummary._id}
              onClick={() => handleCourseSelect(courseSummary)}
            />
          ))}
        </motion.div>
        {/* Khu vực hiển thị chi tiết khóa học được chọn */}
        {selectedCourseId && (
          <motion.div
            ref={selectedCourseRef}
            key={selectedCourseId} // Key giúp animation chạy lại
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="search__selected_course lg:w-1/3 lg:flex-shrink-0 min-w-0" // Thêm relative
          >
            {/* Xử lý trạng thái Loading của hook chi tiết */}
            {isLoadingDetail && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-md">
                <Loading />
              </div>
            )}

            {/* Xử lý trạng thái Lỗi của hook chi tiết */}
            {!isLoadingDetail && isDetailError && (
              <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
                <p className="font-semibold">Lỗi</p>
                <p>Không thể tải chi tiết khóa học này. Vui lòng chọn lại.</p>
              </div>
            )}

            {/* Hiển thị component chi tiết khi fetch thành công và có dữ liệu */}
            {!isLoadingDetail && !isDetailError && selectedCourseData && (
              <SelectedCourse
                course={selectedCourseData}
                handleEnrollNow={handleEnrollNow}
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
