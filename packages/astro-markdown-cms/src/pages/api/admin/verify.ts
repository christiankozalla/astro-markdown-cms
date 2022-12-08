import { APIRoute } from "astro";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { sessionName } from "../../../blog-backend/auth";
import { join } from "node:path";
import * as dbClient from "../../../blog-backend/db-client";
import * as helpers from "../../../blog-backend/helpers";

const htmlResponse = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Email Verification - Astro Markdown CMS</title>
<style>body {font-family: system-ui, sans-serif;}</style>
</head>
<body>
  <h1>Email Verification has failed</h1>
  <a href="/">Return to Home</a>
</body>
</html>`;

export const get: APIRoute = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const token = searchParams.get("token"); // Buffer.from(token, 'base64-url').toString() // {uuid, expires, email}
  const tokenValue = helpers.tryParseToJsonObject(helpers.toUTF8(token));

  if (!tokenValue) {
    return new Response(
      htmlResponse,
      {
        status: 422,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  const { email, expires, uuid } = tokenValue as {
    email: string;
    expires: number;
    uuid: string;
  };

  if (Date.now() > expires) {
    return new Response(htmlResponse, {
      status: 422,
      headers: { "Content-Type": "text/html" },
    });
  }

  const pendingUsers = (await readFile(
    join(process.cwd(), "data", "cms", "pending-users.txt"),
    { encoding: "utf8" },
  )).split("\n");

  for (let i = 0; i < pendingUsers.length; i++) {
    const [email, pw, name, savedUUID] = pendingUsers[i].split(";");
    if (savedUUID === uuid) {
      // From register.ts on success
      const expiryDate = helpers.createExpiryDate();
      const session = helpers.createSession(email, expiryDate);
      const appendSession = dbClient.login(session);

      const appendUser = appendFile(
        join(process.cwd(), "data", "cms", "users.txt"),
        helpers.csv(email, pw, name),
        { encoding: "utf8" },
      );

      const deletePending = writeFile(
        join(process.cwd(), "data", "cms", "pending-users.txt"),
        pendingUsers.filter((entry) => entry.split(";")[3] !== uuid).join("\n"),
        { encoding: "utf8" },
      );

      await Promise.allSettled([appendUser, appendSession, deletePending]);

      const cookie = `${sessionName}=${session}; expires=${new Date(
        expiryDate,
      )}; Path=/; ${import.meta.env.PROD ? "httpsOnly; secure;" : ""}`;

      return new Response(
        `
      <head><meta http-equiv="Refresh" content="0; URL=${
          new URL(request.url).origin
        }/admin" /></head>
      `,
        {
          status: 201,
          headers: { "Set-Cookie": cookie, "Content-Type": "text/html" },
        },
      );
    }
  }

  return new Response(
    htmlResponse,
    {
      status: 403,
      headers: { "Content-Type": "text/html" },
    },
  );
};
