import type { Post } from "./types.js";
export declare function getUsers(): Promise<string>;
export declare function readSessions(): Promise<string[]>;
export declare function login(session: string): Promise<void>;
export declare function logout(emailBase64: string, sessions: string[]): Promise<void>;
export declare function listPosts(): Promise<{
    fileName: string;
    slug: string;
    hasPublished: boolean;
    hasDraft: boolean;
}[]>;
export declare function allPosts(): Promise<[string[], string[]]>;
export declare function getPost(id: string, draft?: boolean): Promise<{
    post: Post | null;
    error: null | Error;
    hasAlternative: string;
}>;
export declare function writePost(id: string, post: Post, isDraft: boolean): Promise<void>;
