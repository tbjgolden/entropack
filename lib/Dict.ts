// allow pattern matching

type StringSuggest<BaseType extends string | number | symbol> =
  | string
  | (BaseType & Record<never, never>);
type ConditionalKeys<Base, Condition> = NonNullable<
  { [Key in keyof Base]: Base[Key] extends Condition ? Key : never }[keyof Base]
>;

type WritableJsonObject = { [Key in string]?: JsonValue | undefined };
type JsonObject = Readonly<WritableJsonObject>;
type JsonArray = ReadonlyArray<JsonValue>;
type JsonPrimitive = string | number | boolean | undefined;
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

type RawValue = JsonPrimitive | Dict<JsonObject> | RawValue[];
type DictEntry = readonly [key: string, value: Readonly<RawValue>];

type A<T extends JsonObject> = {
  [K in keyof T]: T[K] extends JsonObject ? Dict<T[K]> : B<T[K]>;
};
type B<T extends JsonValue> = T extends JsonObject
  ? A<T>
  : T extends JsonArray
  ? { [K in keyof T & number]: B<T[K]> }
  : T;

function isArr(value: unknown): value is unknown[] | ReadonlyArray<unknown> {
  return Array.isArray(value);
}

function toArrWithDicts(array: readonly JsonValue[]) {
  const safeArray: RawValue[] = [];
  for (const value of array) {
    if (typeof value === "object") {
      safeArray.push(
        isArr(value) ? toArrWithDicts(value) : new Dict(value as { [x: string]: JsonValue })
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

function toJsonArray(value: readonly RawValue[]): JsonArray {
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

export class Dict<Shape extends Readonly<JsonObject>> {
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

  static equal<T extends JsonObject, U extends JsonObject>(
    a: Dict<T> | T,
    b: Dict<U> | U
  ): boolean {
    const aDict = a instanceof Dict ? a : new Dict(a);
    const bDict = b instanceof Dict ? b : new Dict(b);
    return aDict.toString() === bDict.toString();
  }

  matches<T extends JsonObject>(mask: Dict<T> | T): boolean {
    const maskDict = mask instanceof Dict ? mask : new Dict(mask);

    for (const [key, maskValue] of maskDict.entries) {
      if (this.#contentsAsObject.has(key)) {
        const value = this.#contentsAsObject.get(key);
        if (toString(maskValue) !== toString(value)) return false;
      } else {
        return false;
      }
    }
    return true;
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
      const o: WritableJsonObject = Object.create(null);
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
