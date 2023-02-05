export function error(...args: unknown[]): never {
  console.error(...args);
  process.exit(1);
}
