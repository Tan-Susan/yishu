import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 网站地址: https://tan-susan.github.io/yishu/
  base: '/yishu/',
  build: {
    outDir: 'dist'
  }
})
