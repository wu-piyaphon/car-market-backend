import * as path from 'path';

export const resolvePath = (...pathSegments: string[]): string => {
  try {
    // Try __dirname first (works in local development)
    return path.join(__dirname, ...pathSegments);
  } catch {
    // Fallback to process.cwd() for production
    return path.resolve(process.cwd(), 'src', ...pathSegments);
  }
};
