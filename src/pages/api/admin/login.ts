import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { User } from "blog-backend";
import { dbClient, decrypt, helpers } from "blog-backend";
import { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const body = await request.json() as User;
  const users = await readFile(
    join(process.cwd(), "data", "cms", "users.txt"),
    { encoding: "utf8" },
  );

  if (helpers.checkExistingUser(body.email, users)) {
    const [email, encryptedPassword, name] = helpers.getUser(
      body.email,
      users,
    ).split(";");
    const isPasswordValid =
      body.password === decrypt(JSON.parse(encryptedPassword));

    if (isPasswordValid) {
      const expiryDate = helpers.createExpiryDate();
      const session = helpers.createSession(body.email, expiryDate);

      const sessions = await dbClient.readSessions();
      // deletes all sessions of this user
      await dbClient.logout(body.email, sessions);
      await dbClient.login(session);

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
