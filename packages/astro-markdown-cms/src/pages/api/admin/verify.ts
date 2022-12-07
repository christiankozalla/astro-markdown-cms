import { APIRoute } from "astro";
import * as helpers from "../../../blog-backend/helpers";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import * as dbClient from "../../../blog-backend/db-client";
import { sessionName } from "../../../blog-backend/auth";

export const get: APIRoute = async ({ request, redirect }) => {
  const searchParams = new URL(request.url).searchParams;
  const token = searchParams.get("token"); // Buffer.from(token, 'base64-url').toString() // {uuid, expires, email}
  if (!token) {
    return redirect("/bad-token");
  }

  const { email, expires, uuid } = JSON.parse(helpers.toUTF8(token));
  console.log(email, expires, uuid);
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

  // take a token as a query param
  // the token is a base64-encoded object: email, expires, uuid
  // parse the data
  // look into file "pending-users.txt"
  // match with an existing entry => YES : NO
  // YES: move (copy and delete) entry from "pending-verification.txt" to "users.txt" (without "uuid")
  // NO: WHY => "EXPIRED" : "NOMATCH"
  // NOMATCH: return redirect("/bad-token")
  // EXPIRED: return redirect("/token-expired") AND delete entry from "pending-verification.txt"

  return redirect("/bad-token");
};
