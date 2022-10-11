import type { Post } from "../../types";
export type Cookie = Record<string, string>;

export function checkExistingUser(email: string, list: string) {
  const emailExits = list.split("\n").some((entry) => entry.startsWith(email));

  return emailExits;
}

export function getSession(email: string, list: string) {
  return list.split("\n").find((entry) => entry.startsWith(email));
}

export function getUser(email: string, list: string) {
  return list.split("\n").find((entry) => entry.startsWith(email));
}

export function purgeList(email: string, list: string[]) {
  if (Array.isArray(list)) {
    return list.filter((entry) => !entry.startsWith(email)).filter(Boolean);
  } else {
    return [];
  }
}

export function base64(string: string) {
  return Buffer.from(string).toString("base64url");
}

export function csv(...strings: string[]) {
  return strings.join(";") + "\n";
}

function randomString() {
  return (Math.random() + 1).toString(36).substring(2);
}

export function hasSemi(...strings: string[]) {
  return strings.includes(";");
}

export function createSession(emailBase64: string, expiryDateMs: number) {
  return `${emailBase64}:::${randomString()}:::${
    expiryDateMs || createExpiryDate()
  }`;
}

export function createExpiryDate() {
  const date = new Date();
  return date.setDate(date.getDate() + 7);
}

export function hasSuperUser(users: string) {
  return users.split("\n").filter(Boolean).length > 1;
}

export function parseCookies(cookies: string): Cookie[] {
  if (!cookies) return [];
  const arrayLike = cookies.split(";").map((cookie) => cookie.split("="));
  return arrayLike.map(([key, value]) => ({ [key]: value }));
}

export function emptyPost(): Post {
  return {
    markdown: "",
    frontMatter: {
      title: "",
      description: "",
      heroImage: "",
      pubDate: "",
      layout: "../../layouts/BlogPost.astro",
    },
  };
}

export function slugify(title: string): string {
  return title.replaceAll(" ", "-").toLowerCase();
}
