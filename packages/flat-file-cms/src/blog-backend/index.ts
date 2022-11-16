import { decrypt, encrypt } from "./hash.js";
import { authenticationHandler } from "./auth.js";
import { initBlogFileSystem } from "./init-blog-files.js";
import { initAuthFileSystem } from "./init-auth-files.js";
import * as dbClient from "./db-client.js";
import * as helpers from "./helpers.js";

initAuthFileSystem();
initBlogFileSystem();

import type { Frontmatter, Post, Response, User } from "./types.js";

export { authenticationHandler, dbClient, decrypt, encrypt, helpers };

export type { Frontmatter, Post, Response, User };
