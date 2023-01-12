// allow pattern matching

type StringSuggest<BaseType extends string | number | symbol> =
  | string
  | (BaseType & Record<never, never>);
type ConditionalKeys<Base, Condition> = NonNullable<
  { [Key in keyof Base]: Base[Key] extends Condition ? Key : never }[keyof Base]
>;

type WritableJsonObject<Z extends null | undefined> = Z extends undefined
  ? { [Key in string]?: JsonValue<Z> | Z }
  : { [Key in string]: JsonValue<Z> | Z };
type JsonObject<Z extends null | undefined> = Readonly<WritableJsonObject<Z>>;
type JsonArray<Z extends null | undefined> = ReadonlyArray<JsonValue<Z>>;
type JsonPrimitive<Z extends null | undefined> = string | number | boolean | Z;
type JsonValue<Z extends null | undefined> = JsonPrimitive<Z> | JsonArray<Z> | JsonObject<Z>;

type RawValue = JsonPrimitive<undefined> | Dict<JsonObject<undefined>> | RawValue[];
type DictEntry = readonly [key: string, value: Readonly<RawValue>];

type A<T extends JsonObject<undefined>> = {
  [K in keyof T]: T[K] extends JsonObject<undefined> ? Dict<T[K]> : B<T[K]>;
};
type B<T extends JsonValue<undefined>> = T extends JsonObject<undefined>
  ? A<T>
  : T extends JsonArray<undefined>
  ? { [K in keyof T & number]: B<T[K]> }
  : T;

function isArr(value: unknown): value is unknown[] | ReadonlyArray<unknown> {
  return Array.isArray(value);
}

function toArrWithDicts(array: readonly JsonValue<undefined>[]) {
  const safeArray: RawValue[] = [];
  for (const value of array) {
    if (typeof value === "object") {
      safeArray.push(
        isArr(value)
          ? toArrWithDicts(value)
          : new Dict(value as { [x: string]: JsonValue<undefined> })
      );
    } else {
      safeArray.push(value);
    }
  }
  return safeArray;
}

function binarySearch(array: { k: string }[], k: string) {
  let start = 0;
  let end = array.length;
  while (start !== end) {
    const mid = (end - start) >> 1;
    // eslint-disable-next-line security/detect-object-injection
    if (k < array[mid].k) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }
  return start;
}

function toJsonArray(value: readonly RawValue[]): JsonArray<undefined> {
  return value.map((item) => {
    if (typeof item === "object") {
      return isArr(item) ? toJsonArray(item) : item.toJSON();
    } else {
      return item;
    }
  });
}

function toString(value: Readonly<RawValue>): string {
  if (typeof value === "object") {
    return isArr(value) ? toStringArr(value) : value.toString();
  } else if (typeof value === "string") {
    return JSON.stringify(value);
  } else {
    return `${value}`;
  }
}

function toStringArr(value: ReadonlyArray<Readonly<RawValue>>): string {
  return "[" + value.map((v) => toString(v)) + "]";
}

export class Dict<Shape extends Readonly<JsonObject<undefined>>> {
  #contentsAsObject: Map<keyof Shape, Readonly<RawValue>>;
  #contentsAsEntries: Array<{ k: string; v: Readonly<RawValue> }> = [];

  #json: Shape | undefined;

  entries: ReadonlyArray<DictEntry>;
  keys: ReadonlyArray<string>;
  values: ReadonlyArray<Readonly<RawValue>>;

  size = 0;

  constructor(object: Shape) {
    this.#contentsAsObject = new Map();

    const entries: DictEntry[] = [];
    const keys: string[] = [];
    const values: Readonly<RawValue>[] = [];

    for (const [k, v] of Object.entries(object)) {
      if (v === undefined) {
        continue;
      } else {
        const i = binarySearch(this.#contentsAsEntries, k);
        let value: Readonly<RawValue>;
        if (typeof v === "object") {
          value = isArr(v) ? toArrWithDicts(v) : new Dict(v);
        } else {
          if (
            typeof v === "number" &&
            (Number.isNaN(v) ||
              !Number.isFinite(v) ||
              (Number.isInteger(v) && !Number.isSafeInteger(v)))
          ) {
            throw new TypeError(`${v} is not safe (Dict)`);
          }
          value = v;
        }
        this.#contentsAsEntries.splice(i, 0, { k, v: value });
        this.#contentsAsObject.set(k, value);
        keys.splice(i, 0, k);
        values.splice(i, 0, value);
        entries.splice(i, 0, [k, value]);
        this.size += 1;
      }
    }

    this.entries = Object.freeze(entries);
    this.keys = Object.freeze(keys);
    this.values = Object.freeze(values);
  }

  get<K extends keyof Shape>(key: StringSuggest<K>): A<Shape>[K] {
    return this.#contentsAsObject.get(key) as A<Shape>[K];
  }

  has<K extends keyof Shape>(
    key: StringSuggest<K>
  ): key is Exclude<K, ConditionalKeys<Shape, undefined>> {
    return this.#contentsAsObject.has(key);
  }

  toJSON(): Shape {
    let json: Shape;
    if (this.#json === undefined) {
      const o: WritableJsonObject<undefined> = Object.create(null);
      for (const [k, v] of this.entries) {
        if (typeof v === "object") {
          // eslint-disable-next-line security/detect-object-injection
          o[k] = isArr(v) ? toJsonArray(v) : v.toJSON();
        } else {
          // eslint-disable-next-line security/detect-object-injection
          o[k] = v;
        }
      }
      json = Object.freeze(o) as Shape;
      this.#json = json;
    } else {
      json = this.#json;
    }
    return json;
  }

  toString() {
    return "{" + this.entries.map(([k, v]) => JSON.stringify(k) + ":" + toString(v)) + "}";
  }
}
