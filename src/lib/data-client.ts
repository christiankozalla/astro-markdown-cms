import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { marked } from 'marked';

type Post = {
  html: string,
  frontMatter: {
    title: string,
    description: string,
    pubDate: string,
    heroImage: string,
    layout?: string,
  }
}

const blogBaseDir = join(process.cwd(), 'data', 'blog');

async function allPosts() {
  return readdir(blogBaseDir);
}

export async function getPost(id: string) {
  const fileName = `${id}.md`;
  const posts = await allPosts();
  if (posts.includes(fileName)) {
    const raw = await readFile(join(blogBaseDir, fileName), {
      encoding: 'utf8'
    });
    const post = parseFrontmatterAndMarkdown(raw);
    return {
      post,
      error: null
    };
  } else {
    return {
      post: null,
      error: new Error(`${fileName} - Blog post not found.`)
    };
  }
}

function parseFrontmatterAndMarkdown(raw: string): Post | null {
  const regex = /---\n([\S\s]*?)\n---/g;
  const result = regex.exec(raw);
  if (result === null) {
    return null;
  } else {
    const lines = result[1].split('\n').filter(Boolean).map((line) => {
      const [key, value] = line.split(': ');
      return `"${key}":${value}`;
    });
    const strigified = `{${lines.join(',')}}`;
    const frontMatter = JSON.parse(strigified);
    const html = marked.parse(raw.slice(raw.indexOf('---\n\n') + 5));
    return {
      html,
      frontMatter,
    };
  }
}