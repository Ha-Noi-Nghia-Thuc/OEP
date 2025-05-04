import type { Config } from "tailwindcss";

const withOpacity = (variableName: string) => {
  return ({ opacityValue }: { opacityValue?: number }) => {
    if (opacityValue !== undefined) {
      return `hsla(var(${variableName}), ${opacityValue})`;
    }
    return `hsl(var(${variableName}))`;
  };
};

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      // --- BẮT ĐẦU ĐIỀU CHỈNH MÀU SẮC ---
      colors: {
        // Các biến màu cơ bản theo phong cách "Mực Tàu & Giấy Dó"
        border: "hsl(var(--border))", // Viền: Nâu đất/Đen nhạt
        input: "hsl(var(--input))", // Viền input: Tương tự border hoặc nhạt hơn chút
        ring: "hsl(var(--ring))", // Focus ring: Màu đỏ son (primary)
        background: "hsl(var(--background))", // Nền: Màu giấy dó ngà/kem
        foreground: "hsl(var(--foreground))", // Chữ: Màu mực tàu đen/nâu sẫm

        // Dải màu chính: Đỏ son và các sắc độ liên quan
        primary: {
          "50": "#fdecef", // Sáng nhất (hơi hồng)
          "100": "#fbdfe2",
          "200": "#f7c1c7",
          "300": "#f099a3",
          "400": "#e86978",
          "500": "#dd4054", // Màu đỏ son chủ đạo (gần với HSL đề xuất)
          "600": "#c62a3e", // Đậm hơn
          "700": "#a61f34",
          "800": "#8b1e30",
          "900": "#751e2d",
          "950": "#460b16", // Đậm nhất
          DEFAULT: "hsl(var(--primary))", // Màu đỏ son chính
          foreground: "hsl(var(--primary-foreground))", // Chữ trên nền primary: Màu giấy dó
        },

        // Dải màu phụ: Nâu/Xám tro và các sắc độ liên quan
        secondary: {
          "50": "#f7f6f5", // Sáng nhất (gần trắng ngà)
          "100": "#eceae7",
          "200": "#ded8d3",
          "300": "#c9bfb9",
          "400": "#b1a29d",
          "500": "#9c8a84", // Màu nâu/xám tro chủ đạo
          "600": "#897670", // Đậm hơn
          "700": "#73625d",
          "800": "#60524e",
          "900": "#514643",
          "950": "#302927", // Đậm nhất
          DEFAULT: "hsl(var(--secondary))", // Màu nâu/xám tro chính
          foreground: "hsl(var(--secondary-foreground))", // Chữ trên nền secondary: Màu mực tàu
        },

        // Màu cảnh báo: Dùng sắc đỏ đậm hơn
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Đỏ cảnh báo
          foreground: "hsl(var(--destructive-foreground))", // Chữ trên nền destructive: Màu giấy dó
        },

        // Màu phụ, ít nổi bật: Be/Xám nhạt
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))", // Chữ trên nền muted: Nâu/Xám vừa
        },

        // Màu nhấn phụ: Vàng nâu cũ
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))", // Chữ trên nền accent: Màu mực tàu
        },

        // Màu nền cho popover: Tương tự card/background
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))", // Chữ trong popover: Màu mực tàu
        },

        // Màu nền cho card: Tương tự background hoặc đậm/nhạt hơn chút
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))", // Chữ trong card: Màu mực tàu
        },

        // Màu cho sidebar (có thể tùy chỉnh khác biệt)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))", // Nền sidebar: Giấy dó hơi đậm hơn
          foreground: "hsl(var(--sidebar-foreground))", // Chữ sidebar: Mực tàu
          primary: "hsl(var(--sidebar-primary))", // Màu chính sidebar: Đỏ son
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))", // Chữ trên nền chính: Giấy dó
          accent: "hsl(var(--sidebar-accent))", // Màu nhấn sidebar: Vàng nâu
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))", // Chữ trên nền nhấn: Mực tàu
          border: "hsl(var(--sidebar-border))", // Viền sidebar: Nâu đất
          ring: "hsl(var(--sidebar-ring))", // Ring sidebar: Đỏ son
        },

        // Giữ lại customgreys nếu bạn dùng cho dark mode hoặc mục đích khác
        customgreys: {
          primarybg: "#1B1C22",
          secondarybg: "#25262F",
          darkGrey: "#17181D",
          darkerGrey: "#3d3d3d",
          dirtyGrey: "#6e6e6e",
        },

        // Giữ lại hoặc điều chỉnh white-50 nếu cần
        white: {
          "50": "#d2d2d2", // Có thể đổi thành màu trắng ngà rất nhạt nếu muốn
          "100": "#ffffff", // Giữ nguyên trắng tinh
          DEFAULT: "ffffff",
        },

        // Giữ lại màu vàng này, khá hợp làm accent
        tertiary: {
          "50": "#E9B306",
        },

        // Giữ cấu trúc, bạn cần định nghĩa biến CSS cho các màu chart này
        chart: {
          "1": "hsl(var(--chart-1))", // Ví dụ: Màu đỏ son
          "2": "hsl(var(--chart-2))", // Ví dụ: Màu vàng nâu
          "3": "hsl(var(--chart-3))", // Ví dụ: Màu nâu đất
          "4": "hsl(var(--chart-4))", // Ví dụ: Màu xám tro
          "5": "hsl(var(--chart-5))", // Ví dụ: Màu đỏ son nhạt hơn
        },
      },
      // --- KẾT THÚC ĐIỀU CHỈNH MÀU SẮC ---

      // Giữ nguyên cấu hình border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      fontFamily: {
        heading: ["var(--font-eb-garamond)", "serif"], // Font cho tiêu đề, thêm fallback 'serif'
        body: ["var(--font-noto-serif)", "serif"], // Font cho nội dung/văn bản, thêm fallback 'serif'
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), "prettier-plugin-tailwindcss"],
} satisfies Config;
