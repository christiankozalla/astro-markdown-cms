import { readFile } from "node:fs/promises";
import { join } from "path";
import { getSession } from "./helpers.js";

export const sessionName = import.meta.env.MARKDOWN_CMS_SESSION_NAME ||
  process.env.MARKDOWN_CMS_SESSION_NAME || "markdown-cms-session";

export async function authenticationHandler(cookies: Record<string, string>[]) {
  if (typeof sessionName !== "string") {
    throw new Error(
      "Please provide an environment variable MARKDOWN_CMS_SESSION_NAME as a cookie name.",
    );
  }
  // check if user has a cookie
  const cookie = cookies.find((cookie) =>
    Object.prototype.hasOwnProperty.call(cookie, sessionName)
  );

  if (cookie) {
    const sessionData = await validateSession(cookie[sessionName]);
    return sessionData;
  } else {
    return { isValid: false, email: undefined };
  }
}

async function validateSession(
  cookie: string,
): Promise<{ isValid: boolean; email: string }> {
  const [email, token, expires] = decodeURIComponent(cookie).split(":::");
  const now = Date.now();
  if (now > Number(expires)) return { isValid: false, email };

  const sessions = await readFile(
    join(process.cwd(), "data", "cms", "sessions.txt"),
    { encoding: "utf8" },
  );

  const session = getSession(email, sessions);

  if (!session) return { isValid: false, email };

  return { isValid: session.split(":::")[1] === token, email };
}
