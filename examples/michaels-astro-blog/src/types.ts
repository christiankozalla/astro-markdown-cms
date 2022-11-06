declare global {
  interface Window {
    post: {
      html?: string;
      markdown: string;
      frontMatter: Record<string, string>;
    };
  }
}

export type Post = {
  html?: string;
  markdown: string;
  frontMatter: Frontmatter;
};

export type Frontmatter = {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
  layout?: string;
  updateDate?: string;
};

export type User = {
  email: string;
  password: string;
  name?: string;
};
