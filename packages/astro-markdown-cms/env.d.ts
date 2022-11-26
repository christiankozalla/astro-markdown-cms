interface ImportMeta {
  readonly env: {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly MARKDOWN_CMS_SECRET?: string;
    readonly MARKDOWN_CMS_SESSION_NAME?: string;
  };
}
