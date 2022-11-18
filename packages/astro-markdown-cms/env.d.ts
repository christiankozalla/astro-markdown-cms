interface ImportMeta {
  readonly env: {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly CMS_SECRET?: string;
    readonly SESSION_NAME?: string;
  };
}
