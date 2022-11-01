// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import { initAuthFileSystem, initBlogFileSystem } from "blog-backend";
initAuthFileSystem();
initBlogFileSystem();

export const SITE_TITLE = "Michaels Website";
export const SITE_DESCRIPTION = "Eine Website aus dem Leben von Michael Kozalla.";
