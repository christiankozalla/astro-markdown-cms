import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// import { initAuthFileSystem, initBlogFileSystem } from "./blog-backend";
// initAuthFileSystem();
// initBlogFileSystem();
// type EnvNames = "CMS_SECRET" | "SESSION_NAME";
// export interface CmsOptions {
//   env: Record<EnvNames, string>;
// }
const _dirname = typeof __dirname !== "undefined"
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));
export default function flatFileCmsIntegration(
// options?: CmsOptions,
) {
    // Environment Variables are not available in astro.config.mjs
    // import.meta.env.SESSION_NAME = options.env.SESSION_NAME;
    // import.meta.env.CMS_SECRET = options.env.CMS_SECRET;
    // _dirname will be the "dist" directory of the package - i.e. the root directory
    // const pages = await readdir(join(_dirname, "pages"), { withFileTypes: true });
    return {
        name: "flat-file-cms",
        hooks: {
            "astro:config:setup": ({ updateConfig, injectRoute }) => {
                // updateConfig({
                //   vite: {
                //     ssr: {
                //       noExternal: [
                //         "flat-file-cms",
                //       ],
                //     },
                //   },
                // });
                injectRoute({
                    pattern: "/admin",
                    entryPoint: join(_dirname, "pages", "admin", "index.astro"),
                });
                injectRoute({
                    pattern: "/admin/login",
                    entryPoint: join(_dirname, "pages", "admin", "login.astro"),
                });
                injectRoute({
                    pattern: "/admin/register",
                    entryPoint: join(_dirname, "pages", "admin", "register.astro"),
                });
                injectRoute({
                    pattern: "/admin/posts/new",
                    entryPoint: join(_dirname, "pages", "admin", "posts", "new.astro"),
                });
                injectRoute({
                    pattern: "/admin/[post]",
                    entryPoint: join(_dirname, "pages", "admin", "[post].astro"),
                });
                // Endpoints
                injectRoute({
                    pattern: "/api/admin/login",
                    entryPoint: join(_dirname, "pages", "api", "admin", "login.ts"),
                });
                injectRoute({
                    pattern: "/api/admin/register",
                    entryPoint: join(_dirname, "pages", "api", "admin", "register.ts"),
                });
                injectRoute({
                    pattern: "/api/admin/posts/[slug]",
                    entryPoint: join(_dirname, "pages", "api", "admin", "posts", "[slug].ts"),
                });
            },
        },
    };
}
