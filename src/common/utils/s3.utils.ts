/**
 * Extracts the S3 object key from a full S3 URL.
 * @param url The full S3 URL.
 * @returns The S3 object key (path after the bucket).
 */
export function extractS3KeyFromUrl(url: string): string {
  const { pathname } = new URL(url);
  // Remove leading slash
  return pathname.startsWith('/') ? pathname.slice(1) : pathname;
}
