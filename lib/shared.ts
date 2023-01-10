export function isIterable(value: unknown): value is Iterable<unknown> {
  if (typeof value !== "object" || value === null) return false;
  return Symbol.iterator in value && typeof value[Symbol.iterator] === "function";
}
