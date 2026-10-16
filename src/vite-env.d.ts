/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deployment context for the review header, filled from Vercel at build time. */
  readonly VITE_DEPLOY_ENV?: string;
  readonly VITE_DEPLOY_BRANCH?: string;
  readonly VITE_DEPLOY_COMMIT?: string;
}
