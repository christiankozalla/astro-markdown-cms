import { appendFile, readdir, readFile, unlink, writeFile, } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { purgeList } from "./helpers.js";
const sessionsPath = join(process.cwd(), "data", "cms", "sessions.txt");
const blogDir = join(process.cwd(), "data", "blog");
export async function getUsers() {
    return await readFile(join(process.cwd(), "data", "cms", "users.txt"), { encoding: "utf8" });
}
export async function readSessions() {
    const strings = await readFile(sessionsPath, { encoding: "utf8" });
    const sessions = strings.split("\n");
    return sessions;
}
export function login(session) {
    return appendFile(sessionsPath, "\n" + session + "\n", { encoding: "utf8" });
}
// Delete all sessions with base64-encoded email
export function logout(emailBase64, sessions) {
    return writeFile(sessionsPath, purgeList(emailBase64, sessions).join("\n"), {
        encoding: "utf8",
    });
}
// // Display a list of published and draft posts in the dashboard
export async function listPosts() {
    const [published, drafts] = await allPosts();
    // please forgive me...
    published.splice(published.indexOf("drafts"), 1);
    const posts = Array.from(new Set([...published, ...drafts])).map((file) => {
        return {
            fileName: file,
            slug: file.slice(0, file.indexOf(".md")),
            hasPublished: published.includes(file),
            hasDraft: drafts.includes(file),
        };
    });
    return posts;
}
export async function allPosts() {
    return Promise.all([
        readdir(blogDir),
        readdir(join(blogDir, "drafts")),
    ]);
}
export async function getPost(id, draft = false) {
    const fileName = `${id}.md`;
    const [posts, drafts] = await allPosts();
    const response = { post: null, error: null, hasAlternative: "" };
    if (Array.isArray(posts) && posts.includes(fileName)) {
        const raw = await readFile(join(blogDir, fileName), {
            encoding: "utf8",
        });
        response.post = parseFrontmatterAndMarkdown(raw);
    }
    if (Array.isArray(drafts) && drafts.includes(fileName)) {
        if (draft) {
            // alternative is the published post
            response.hasAlternative = `/admin/${id}`;
            const raw = await readFile(join(blogDir, "drafts", fileName), {
                encoding: "utf8",
            });
            response.post = parseFrontmatterAndMarkdown(raw);
        }
        else {
            response.hasAlternative = `/admin/${id}?draft`;
        }
    }
    if (response.post === null) {
        response.error = new Error(`${fileName} - Blog post not found.`);
    }
    return response;
}
export async function writePost(id, post, isDraft) {
    const fileName = `${id}.md`;
    let destination;
    if (isDraft) {
        destination = join(blogDir, "drafts", fileName);
    }
    else {
        destination = join(blogDir, fileName);
        try {
            const draftUrl = join(blogDir, "drafts", fileName);
            // and delete the draft before publishing
            await unlink(draftUrl);
        }
        catch (err) {
            if (err instanceof Error) {
                // file does not exist - log and move on
                console.log(err.message);
            }
            else {
                console.log(err);
            }
        }
    }
    return writeFile(destination, serializePost(post), { encoding: "utf8" });
}
function parseFrontmatterAndMarkdown(raw) {
    const regex = /---\n([\S\s]*?)\n---/g;
    const result = regex.exec(raw);
    if (result === null) {
        return null;
    }
    else {
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
function serializePost(post) {
    const yamlFrontMatter = `---\n${Object.entries(post.frontMatter).map(([key, value]) => `${key}: "${value}"`)
        .join("\n")}\n---\n\n`;
    return yamlFrontMatter + post.markdown;
}
