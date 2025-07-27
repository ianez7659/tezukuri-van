/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // mdx도 포함하면 더 안전함
  ],
  darkMode: "class", // 또는 'media'
  theme: {
    extend: {
      // 예: 색상, 폰트 등 커스텀 스타일 확장 가능
      colors: {
        // foreground: "var(--foreground)",
        // background: "var(--background)",
        background: "var(--color-bg)",
        foreground: "var(--color-fg)",
        muted: "var(--color-muted)",
        heading: "var(--color-heading)",
        border: "var(--color-border)",
      },
    },
  },
  plugins: [],
};
