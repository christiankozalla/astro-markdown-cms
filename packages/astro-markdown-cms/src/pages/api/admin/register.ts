import { APIRoute } from "astro";
import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { User } from "../../../blog-backend/types";
import * as helpers from "../../../blog-backend/helpers";
import * as dbClient from "../../../blog-backend/db-client";
import { encrypt } from "../../../blog-backend/hash";
import { sessionName } from "../../../blog-backend/auth";

export const post: APIRoute = async ({ request }) => {
  const body = (await request.json()) as User;
  if (helpers.hasSemi(body.email, body.name || "")) {
    console.log("Email or Name include a Semicolon - Forbidden!");
    return new Response(null, { status: 422 });
  }

  const users = await readFile(
    join(process.cwd(), "data", "cms", "users.txt"),
    { encoding: "utf8" },
  );
  if (helpers.hasSuperUser(users)) {
    console.log("Only a single user - the superuser - is allowed.");
    return new Response(null, { status: 409 });
  } else if (helpers.checkExistingUser(body.email, users)) {
    console.log("User already exists!", body.email);
    return new Response(null, { status: 409 });
  } else {
    const encryptedPassword = encrypt(body.password);
    // should login(email) do create session instead and return the session?
    const expiryDate = helpers.createExpiryDate();
    const session = helpers.createSession(body.email, expiryDate);

    const appendUser = appendFile(
      join(process.cwd(), "data", "cms", "users.txt"),
      helpers.csv(
        body.email,
        JSON.stringify(encryptedPassword),
        body.name || "",
      ),
      { encoding: "utf8" },
    );

    const appendSession = dbClient.login(session);

    await Promise.allSettled([appendUser, appendSession]);

    const cookie = `${sessionName}=${session}; expires=${new Date(
      expiryDate,
    )}; Path=/; ${import.meta.env.PROD ? "httpsOnly; secure;" : ""}`;

    return new Response(null, {
      status: 201,
      headers: { "Set-Cookie": cookie },
    });
  }
};
