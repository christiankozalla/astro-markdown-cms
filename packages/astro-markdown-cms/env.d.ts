/// <reference types="astro/client" />

interface ImportMetaEnv {
  MODE: string;
  BASE_URL: string;
  PROD: boolean;
  DEV: boolean;
  CMS_SECRET?: string;
  SESSION_NAME?: string;
}
