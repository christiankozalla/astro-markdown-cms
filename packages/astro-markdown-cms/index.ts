import type { AstroIntegration } from "astro";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { initAuthFileSystem } from "./src/blog-backend/init-auth-files";
import { initBlogFileSystem } from "./src/blog-backend/init-blog-files";
initAuthFileSystem();
initBlogFileSystem();

export * as dbClient from "./src/blog-backend/db-client";

// type EnvNames = "CMS_SECRET" | "SESSION_NAME";

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

export default function flatFileCmsIntegration(): AstroIntegration {
  return {
    name: "flat-file-cms",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        // FIXME: updateConfig seems to have no effect, so I am passing import.meta.env.MY_VAR
        // from Astro endpoints and pages to functions as a parameter!
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
          entryPoint: join(_dirname, "src", "pages", "admin", "index.astro"),
        });

        injectRoute({
          pattern: "/admin/login",
          entryPoint: join(_dirname, "src", "pages", "admin", "login.astro"),
        });

        injectRoute({
          pattern: "/admin/register",
          entryPoint: join(_dirname, "src", "pages", "admin", "register.astro"),
        });

        injectRoute({
          pattern: "/admin/posts/new",
          entryPoint: join(
            _dirname,
            "src",
            "pages",
            "admin",
            "posts",
            "new.astro",
          ),
        });

        injectRoute({
          pattern: "/admin/[post]",
          entryPoint: join(_dirname, "src", "pages", "admin", "[post].astro"),
        });

        // Endpoints
        injectRoute({
          pattern: "/api/admin/login",
          entryPoint: join(
            _dirname,
            "src",
            "pages",
            "api",
            "admin",
            "login.ts",
          ),
        });

        injectRoute({
          pattern: "/api/admin/register",
          entryPoint: join(
            _dirname,
            "src",
            "pages",
            "api",
            "admin",
            "register.ts",
          ),
        });

        injectRoute({
          pattern: "/api/admin/posts/[slug]",
          entryPoint: join(
            _dirname,
            "src",
            "pages",
            "api",
            "admin",
            "posts",
            "[slug].ts",
          ),
        });
      },
    },
  };
}
