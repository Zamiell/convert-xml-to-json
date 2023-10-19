export function fatalError(...args: unknown[]): never {
  console.error(...args);
  process.exit(1);
}
