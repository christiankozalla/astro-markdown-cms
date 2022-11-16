import type { AstroIntegration } from "astro";
export { dbClient } from "./blog-backend/index.js";
export default function flatFileCmsIntegration(): AstroIntegration;
