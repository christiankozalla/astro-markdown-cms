import type { SendMail } from "./types";

export async function sendVerificationEmail(
  base64email: string,
  link: string,
  emailCallback: SendMail,
) {
  const html =
    `<h1>Astro Markdown CMS Verifcation</h1><p>Please click the link: <a href="${link}" target="_blank" rel="noopener">Click Link</a></p>`;
  const to = Buffer.from(base64email, "base64url").toString("utf8");
  return emailCallback({ to, html });
}
