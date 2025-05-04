"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__hero">
        <div className="landing-skeleton__hero-content">
          <Skeleton className="landing-skeleton__title" />
          <Skeleton className="landing-skeleton__subtitle" />
          <Skeleton className="landing-skeleton__subtitle-secondary" />
          <Skeleton className="landing-skeleton__button" />
        </div>
        <Skeleton className="landing-skeletion__hero-image" />
      </div>

      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title" />
        <Skeleton className="landing-skeleton__featured-description" />

        <div className="landing-skeleton__tags">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__tag" />
          ))}
        </div>

        <div className="landing-skeleton__courses">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__course" />
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const currentImage = useCarousel({ totalImages: 3 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="landing"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="landing__hero"
      >
        <div className="landing__hero-content">
          <h1 className="landing__title">
            Tiếp nối tinh thần Đông Kinh Nghĩa Thục: Học Hỏi - Chia Sẻ - Phát
            Triển
          </h1>
          <p className="landing__description">
            Hà Nội Nghĩa Thục mang đến cơ hội học tập miễn phí cho tất cả mọi
            người. Tiếp cận tri thức đa dạng, từ kỹ năng chuyên môn đến kiến
            thức xã hội, trong một cộng đồng hỗ trợ và chia sẻ.
          </p>
          <div className="landing__cta">
            <Link href="/search">
              <div className="landing__cta-button">Khám Phá Khóa Học Ngay</div>
            </Link>
          </div>
        </div>
        <div className="landing__hero-images">
          <Image
            src="/khue-van-cac-hanoi.jpg"
            alt="Khuê Văn Các"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="landing__hero-image landing__hero-image--active"
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className="landing__featured"
      >
        <h2 className="landing__featured-title">Các Khóa Học Nổi Bật</h2>
        <p className="landing__featured-description">
          Tuyển chọn những khóa học chất lượng, được cộng đồng đánh giá cao và
          tham gia nhiều nhất. Luôn cập nhật kiến thức mới và kỹ năng thiết
          thực, hoàn toàn miễn phí.
        </p>
        <div className="landing__tags">
          {[
            "Lịch sử Việt Nam",
            "Kỹ năng mềm",
            "Ngoại ngữ",
            "Kiến thức Kinh tế",
            "Chính trị",
          ].map((tag, index) => (
            <span key={index} className="landing__tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="landing__courses">{/* COURSES DISPLAY */}</div>
      </motion.div>
    </motion.div>
  );
};

export default Landing;
