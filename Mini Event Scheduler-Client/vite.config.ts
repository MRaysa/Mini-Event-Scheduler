import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], // ✅ Correct: Vite plugins go here
  css: {
    postcss: {
      plugins: [], // ✅ PostCSS plugins (like autoprefixer) go here
    },
  },
});
