import { defineConfig } from "@playwright/test";
export default defineConfig({ use:{baseURL:"http://127.0.0.1:4181"}, webServer:{command:"npm run dev -- --host 127.0.0.1 --port 4181",url:"http://127.0.0.1:4181",reuseExistingServer:true} });
