import { APIRoute } from "astro";
import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { SendMail, User } from "../../../blog-backend/types";
import * as helpers from "../../../blog-backend/helpers";
import { encrypt } from "../../../blog-backend/hash";
import { sendVerificationEmail } from "../../../blog-backend/mailer";
let userlandCallback: SendMail;
try {
  userlandCallback = await import(join(process.cwd(), "markdown-cms-mail"))
    .then((module) => module.default);
} catch (error) {
  console.log("Error importing", error);
}

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
    const uuid = randomUUID();
    // store user in "pending-users.txt"
    await appendFile(
      join(process.cwd(), "data", "cms", "pending-users.txt"),
      helpers.csv(
        body.email,
        JSON.stringify(encryptedPassword),
        body.name || "",
        uuid,
      ),
      { encoding: "utf8" },
    );

    // send email
    const expires = Date.now() + (1000 * 60 * 60 * 24); // in one day
    const token = helpers.toBase64(
      JSON.stringify({ email: body.email, expires, uuid }),
    );

    const link = new URL("/api/admin/verify", new URL(request.url).origin);
    link.searchParams.set(
      "token",
      token,
    );

    await sendVerificationEmail(
      body.email,
      link.toString(),
      userlandCallback,
    );
    return new Response(null, { status: 201 });
  }
};
