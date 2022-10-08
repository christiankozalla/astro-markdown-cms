import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  checkExistingUser,
  createExpiryDate,
  createSession,
  getUser,
} from "../../../lib/admin/helpers";
import { decrypt } from "../../../lib/admin/hash";
import { login, logout, readSessions } from "../../../lib/db-client";
import type { User } from "../../../types";
import { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const body = await request.json() as User;
  const users = await readFile(
    join(process.cwd(), "data", "cms", "users.txt"),
    { encoding: "utf8" },
  );

  if (checkExistingUser(body.email, users)) {
    const [email, encryptedPassword, name] = getUser(
      body.email,
      users,
    ).split(";");
    const isPasswordValid =
      body.password === decrypt(JSON.parse(encryptedPassword));

    if (isPasswordValid) {
      const expiryDate = createExpiryDate();
      const session = createSession(body.email, expiryDate);

      const sessions = await readSessions();
      // deletes all sessions of this user
      await logout(body.email, sessions);
      await login(session);

      const cookie =
        `${import.meta.env.SESSION_NAME}=${session}; expires=${new Date(
          expiryDate,
        )}; Path=/; ${import.meta.env.PROD ? "httpsOnly; secure;" : ""}`;

      return new Response(null, {
        status: 200,
        headers: { "Set-Cookie": cookie },
      });
    } else {
      console.log("Bad password - unauthorized");
      return new Response(null, { status: 403 });
    }
  } else {
    console.log("User does not exist");
    return new Response(null, { status: 401 });
  }
};
