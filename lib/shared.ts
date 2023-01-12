export function isIterable(value: unknown): value is Iterable<unknown> {
  if (typeof value !== "object" || value === null) return false;
  return Symbol.iterator in value && typeof value[Symbol.iterator] === "function";
}

export type JsonObject<Z extends null | undefined> = Z extends undefined
  ? { [Key in string]?: JsonValue<Z> | Z }
  : { [Key in string]: JsonValue<Z> | Z };
export type JsonArray<Z extends null | undefined> = Array<JsonValue<Z>>;
export type JsonPrimitive<Z extends null | undefined> = string | number | boolean | Z;
export type JsonValue<Z extends null | undefined> = JsonPrimitive<Z> | JsonArray<Z> | JsonObject<Z>;
