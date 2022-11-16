export declare type Post = {
    html?: string;
    markdown: string;
    frontMatter: Frontmatter;
};
export declare type Frontmatter = {
    title: string;
    description: string;
    pubDate: string;
    heroImage: string;
    layout?: string;
    updateDate?: string;
};
export declare type User = {
    email: string;
    password: string;
    name?: string;
};
export declare type Response = {
    post: Post | null;
    error: Error | null;
    hasAlternative: string;
};
