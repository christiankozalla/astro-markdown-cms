import { APIRoute } from "astro";
import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  checkExistingUser,
  createExpiryDate,
  createSession,
  csv,
  hasSemi,
  hasSuperUser,
} from "../../../lib/admin/helpers";
import { encrypt } from "../../../lib/admin/hash";
import type { User } from "../../../types";
import { login } from "../../../lib/db-client";

export const post: APIRoute = async ({ request }) => {
  const body = await request.json() as User;
  if (hasSemi(body.email, body.name)) {
    console.log("Email or Name include a Semicolon - Forbidden!");
    return;
  }

  const users = await readFile(
    join(process.cwd(), "data", "cms", "users.txt"),
    { encoding: "utf8" },
  );
  if (hasSuperUser(users)) {
    console.log("Only a single user - the superuser - is allowed.");
    return new Response(null, { status: 409 });
  } else if (checkExistingUser(body.email, users)) {
    console.log("User already exists!", body.email);
    return new Response(null, { status: 409 });
  } else {
    const encryptedPassword = encrypt(body.password);
    // should login(email) do create session instead and return the session?
    const expiryDate = createExpiryDate();
    const session = createSession(body.email, expiryDate);

    const appendUser = appendFile(
      join(process.cwd(), "data", "cms", "users.txt"),
      csv(
        body.email,
        JSON.stringify(encryptedPassword),
        body.name || "",
      ),
      { encoding: "utf8" },
    );

    const appendSession = login(session);

    await Promise.allSettled([appendUser, appendSession]);

    const cookie =
      `${import.meta.env.SESSION_NAME}=${session}; expires=${new Date(
        expiryDate,
      )}; Path=/; ${import.meta.env.PROD ? "httpsOnly; secure;" : ""}`;

    return new Response(null, {
      status: 201,
      headers: { "Set-Cookie": cookie },
    });
  }
};
