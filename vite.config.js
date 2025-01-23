import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// alias path 를 만들어주는 콜백함수
const getAliasPath = (path) => {
  return fileURLToPath(new URL(path, import.meta.url));
};

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false  // 이 한 줄만 추가
    }
  },
  resolve: {
    alias: {
      "@Components": getAliasPath("./src/Components"),
      "@src": getAliasPath("./src"),
      "@assets": getAliasPath("./src/assets"),
      "@store": getAliasPath("./src/store"),
    },
  },
});