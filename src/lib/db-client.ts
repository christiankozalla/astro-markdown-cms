import {
  appendFile,
  readdir,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { purgeList } from "./admin/helpers";
import type { Post } from "../types";
const sessionsPath = join(process.cwd(), "data", "cms", "sessions.txt");
const blogDir = join(process.cwd(), "data", "blog");

export async function getUsers() {
  return await readFile(
    join(process.cwd(), "data", "cms", "users.txt"),
    { encoding: "utf8" },
  );
}

export async function readSessions() {
  const strings = await readFile(sessionsPath, { encoding: "utf8" });
  const sessions = strings.split("\n");
  return sessions;
}

export function login(session: string) {
  return appendFile(sessionsPath, "\n" + session + "\n", { encoding: "utf8" });
}

// Delete all sessions with base64-encoded email
export function logout(emailBase64: string, sessions: string[]) {
  return writeFile(sessionsPath, purgeList(emailBase64, sessions).join("\n"), {
    encoding: "utf8",
  });
}

export async function listPosts() {
  return readdir(blogDir);
}

async function allPosts() {
  return readdir(blogDir);
}

export async function getPost(
  id: string,
): Promise<{ post: Post | null; error: null | Error }> {
  const fileName = `${id}.md`;
  const posts = await allPosts();
  if (posts.includes(fileName)) {
    const raw = await readFile(join(blogDir, fileName), {
      encoding: "utf8",
    });
    const post = parseFrontmatterAndMarkdown(raw);
    return {
      post,
      error: null,
    };
  } else {
    return {
      post: null,
      error: new Error(`${fileName} - Blog post not found.`),
    };
  }
}

export async function writePost(id: string, post: Post, isDraft: boolean) {
  const fileName = `${id}.md`;
  let destination: string;
  if (isDraft) {
    destination = join(blogDir, "drafts", fileName);
  } else {
    destination = join(blogDir, fileName);
    // and delete the draft before publishing
    await unlink(join(blogDir, "drafts", fileName));
  }
  return writeFile(destination, serializePost(post), { encoding: "utf8" });
}

function parseFrontmatterAndMarkdown(raw: string): Post | null {
  const regex = /---\n([\S\s]*?)\n---/g;
  const result = regex.exec(raw);
  if (result === null) {
    return null;
  } else {
    const lines = result[1].split("\n").filter(Boolean).map((line) => {
      const [key, value] = line.split(": ");
      return `"${key}":${value}`;
    });
    const strigified = `{${lines.join(",")}}`;
    const frontMatter = JSON.parse(strigified);
    const html = marked.parse(raw.slice(raw.indexOf("---\n\n") + 5));
    const markdown = raw.slice(raw.indexOf("---\n\n") + 5);
    return {
      html,
      markdown,
      frontMatter,
    };
  }
}

function serializePost(post: Post) {
  const yamlFrontMatter = `---\n${
    Object.entries(post.frontMatter).map(([key, value]) => `${key}: "${value}"`)
      .join("\n")
  }\n---\n\n`;
  return yamlFrontMatter + post.markdown;
}
