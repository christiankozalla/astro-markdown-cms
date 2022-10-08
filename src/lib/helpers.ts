export function stripTrailingSlash(url: string): string {
  if (url.endsWith("/")) return url.slice(0, -1);
  else return url;
}
