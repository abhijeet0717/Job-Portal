import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://jobportal-25u3.onrender.com', 
      // '/api': 'htthttp://localhost:8000'
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

//The Vite proxy helps you during local development by forwarding API requests from your frontend to your backend, 
//making it appear as if both are on the same origin. 
// This avoids CORS issues only in development.
// that why we are able to call the backend at render , even if the backend cors : https://jobportal-25u3.onrender.com
// so normally backend should not allow the request from localhost:5173 
//due to proxy in dev , we are able to access the backend at render