import type { Metadata } from "next";
import { EB_Garamond, Noto_Serif } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const ebGaramond = EB_Garamond({
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const notoSerif = Noto_Serif({
  subsets: ["vietnamese", "latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  // === Metadata Cơ bản ===
  title: "Hà Nội Nghĩa Thục | Nền Tảng Giáo Dục Mở Trực Tuyến Miễn Phí",
  description:
    "Nền tảng giáo dục mở miễn phí theo tinh thần khai trí Đông Kinh Nghĩa Thục. Khám phá khóa học, tài liệu đa dạng giúp bạn tự học, nâng cao kiến thức & kỹ năng.",

  // === SEO & Keywords ===
  keywords: [
    "giáo dục mở",
    "học trực tuyến miễn phí",
    "khóa học online",
    "tài liệu học tập",
    "Hà Nội Nghĩa Thục",
    "Đông Kinh Nghĩa Thục",
    "học miễn phí",
    "kỹ năng",
    "kiến thức",
    "phát triển bản thân",
    "cộng đồng học tập",
    "Việt Nam",
    "open education",
    "free online courses",
    "learning platform",
    "Ha Noi Nghia Thuc",
  ],
  // alternates: {
  //   canonical: BASE_URL,
  //   languages: {
  //     "vi-VN": BASE_URL,
  //     "en-US": `${BASE_URL}/en`,
  //   },
  // },

  // Cho phép Google index và theo dõi link
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // === Social Media Sharing (Quan trọng!) ===
  openGraph: {
    title: "Hà Nội Nghĩa Thục | Nền Tảng Giáo Dục Mở Trực Tuyến Miễn Phí",
    description:
      "Nền tảng giáo dục mở miễn phí theo tinh thần khai trí Đông Kinh Nghĩa Thục. Khám phá khóa học, tài liệu đa dạng giúp bạn tự học, nâng cao kiến thức & kỹ năng.",
    // url: BASE_URL,
    siteName: "Hà Nội Nghĩa Thục",
    // images: [
    //   {
    //     url: `${BASE_URL}/og-image.png`,
    //     width: 1200,
    //     height: 630,
    //     alt: "Hà Nội Nghĩa Thục - Học trực tuyến miễn phí",
    //   },
    // ],
    locale: "vi_VN",
    type: "website",
  },

  // === Icons (Favicon, etc.) ===
  // icons: {
  //   icon: "/favicon.ico", // Link tới file favicon.ico
  //   shortcut: "/favicon-16x16.png", // Link tới icon shortcut
  //   apple: "/apple-touch-icon.png", // Link tới icon cho thiết bị Apple
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${ebGaramond.variable} ${notoSerif.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
