export declare function authenticationHandler(cookies: Record<string, string>[], sessionName?: string): Promise<{
    isValid: boolean;
    email: string;
}>;
