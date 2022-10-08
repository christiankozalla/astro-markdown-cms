// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import initBlogDirs from "./lib/admin/init-blog-data";
import initDb from "./lib/admin/init-db";
initDb();
initBlogDirs();

export const SITE_TITLE = "Michaels Website";
export const SITE_DESCRIPTION =
  "Eine Website aus dem Leben von Michael Kozalla.";
