import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Deployment context for the design-space review header; empty locally.
const deploy = {
  VITE_DEPLOY_ENV: process.env.VERCEL_ENV,
  VITE_DEPLOY_BRANCH: process.env.VERCEL_GIT_COMMIT_REF,
  VITE_DEPLOY_COMMIT: process.env.VERCEL_GIT_COMMIT_SHA,
};

export default defineConfig({
  plugins: [react()],
  define: Object.fromEntries(
    Object.entries(deploy)
      .filter(([, value]) => value)
      .map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  ),
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
