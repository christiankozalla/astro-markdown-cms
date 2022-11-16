declare function encrypt(text: string, secretKey?: string): {
    iv: string;
    content: string;
};
declare function decrypt(hash: {
    iv: string;
    content: string;
}, secretKey?: string): string;
export { decrypt, encrypt };
