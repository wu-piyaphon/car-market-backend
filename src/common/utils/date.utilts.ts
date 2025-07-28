/**
 * Returns the current date in the format YYYY-MM-DD.
 * @returns The current date in the format YYYY-MM-DD.
 */
export function getCurrentDatePrefix(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns the current timestamp in milliseconds.
 * @returns The current timestamp in milliseconds.
 */
export function getTimestamp(): number {
  return new Date().getTime();
}
