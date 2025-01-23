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
      // node_modules 디렉토리와 프로젝트 루트 디렉토리에 대한 접근을 허용
      allow: [
        'node_modules/slick-carousel',
        './'  // 프로젝트 루트 디렉토리 추가
      ]
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