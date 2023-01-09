// What don't we like about Objects
// serialisable values
// safe get mechanic
// safe in mechanic
// allow pattern matching

type A = number | string | boolean | undefined;
type B = Readonly<{ [Key in string]: B }> | ReadonlyArray<B> | A;
type C = Readonly<{ [Key in string]: B }>;

// type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

type Value = number | string | boolean | ReadonlyArray<Value | undefined> | Dict<C>;

function toSafeArray(array: readonly B[]) {
  const safeArray: Array<Value | undefined> = [];
  for (const value of array) {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        safeArray.push(toSafeArray(value));
      } else {
        safeArray.push(
          new Dict(
            value as Readonly<{
              [x: string]: B;
            }>
          )
        );
      }
    } else {
      safeArray.push(value);
    }
  }
  return safeArray as ReadonlyArray<Value>;
}

function quickFindIndex(array: { k: string }[], k: string) {
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

export class Dict<Shape extends C> {
  #contents: Array<{ k: string; v: Value }> = [];

  constructor(object: Shape) {
    for (const [k, v] of Object.entries(object)) {
      if (v === undefined) {
        continue;
      } else {
        const i = quickFindIndex(this.#contents, k);
        if (typeof v === "object") {
          if (Array.isArray(v)) {
            this.#contents.splice(i, 0, { k, v: toSafeArray(v) });
          } else {
            this.#contents.splice(i, 0, { k, v: new Dict(v as Readonly<{ [x: string]: B }>) });
          }
        } else {
          this.#contents.splice(i, 0, { k, v });
        }
      }
    }
  }

  toString() {
    return this.#contents
      .map(({ k, v }) => {
        return `  ${k}: ${v}`;
      })
      .join("\n")
      .toString();
  }
}
