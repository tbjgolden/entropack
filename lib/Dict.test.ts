import { Dict } from "./Dict.js";

test("Dict", () => {
  const dict = new Dict({
    hi: "world",
    x: 4,
    a: true,
    he: "he",
    s: undefined,
    aa: ["who", 3, {}, false, undefined, [-1]],
    b: { hello: "bye" },
  } as const);
  expect(dict.toString()).toBe(
    `{"a":true,"aa":["who",3,{},false,undefined,[-1]],"b":{"hello":"bye"},"he":"he","hi":"world","x":4}`
  );
  expect(dict.get("hi")).toBe("world");
  expect(dict.get("b").get("hello")).toBe("bye");
  expect(dict.has("aa")).toBe(true);
  expect(dict.has("s")).toBe(false);
  const json = `{"a":true,"aa":["who",3,{},false,null,[-1]],"b":{"hello":"bye"},"he":"he","hi":"world","x":4}`;
  expect(JSON.stringify(dict)).toBe(json);
  expect(dict.toJSON()).toEqual({
    hi: "world",
    x: 4,
    a: true,
    he: "he",
    s: undefined,
    aa: ["who", 3, {}, false, undefined, [-1]],
    b: { hello: "bye" },
  });
  expect(JSON.stringify(new Dict({ a: 1, b: 2 }))).toBe(JSON.stringify(new Dict({ b: 2, a: 1 })));
});

test("Dict error", () => {
  expect(() => new Dict({ hi: Number.NaN })).toThrow();
});

test("Dict equal", () => {
  expect(Dict.equal({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  expect(Dict.equal({ a: 1, b: 2 }, { b: 1, a: 1 })).toBe(false);
  expect(Dict.equal(new Dict({ a: 1, b: 2 }), new Dict({ b: 2, a: 1 }))).toBe(true);
  expect(Dict.equal({ a: 1, b: 2 }, new Dict({ b: 1, a: 1 }))).toBe(false);
  expect(Dict.equal(new Dict({ a: 1, b: 2 }), { b: 2, a: 1 })).toBe(true);
  expect(Dict.equal({ a: 1, b: 2, C: undefined }, { b: 2, a: 1, d: undefined })).toBe(true);
  expect(Dict.equal({ a: 1, b: 2, c: [undefined] }, { b: 2, a: 1, c: [] })).toBe(false);
  expect(Dict.equal({ a: 1, b: 2, c: [undefined] }, { b: 2, a: 1, c: [] })).toBe(false);
});

test("Dict equal", () => {
  const dict = new Dict({
    hi: "world",
    x: 4,
    a: true,
    he: "he",
    s: undefined,
    aa: ["who", 3, {}, false, undefined, [-1]],
    b: { hello: "bye" },
  } as const);
  expect(dict.matches({})).toBe(true);
  expect(dict.matches({ a: true })).toBe(true);
  expect(dict.matches({ skjaskjaks: true })).toBe(false);
  expect(dict.matches({ a: false })).toBe(false);
  expect(dict.matches(new Dict({ aa: 0 }))).toBe(false);
  expect(dict.matches({ aa: ["who", 3, {}, false, undefined, [-1]] })).toBe(true);
  expect(dict.matches({ aa: ["who", 3, { a: 0 }, false, undefined, [-1]] })).toBe(false);
  expect(dict.matches({ aa: ["who", 3, {}, false, undefined, [undefined, -1]] })).toBe(false);
  expect(dict.matches({ hi: "world", x: 4 })).toBe(true);
  expect(dict.matches({ hi: "world", x: 3 })).toBe(false);
});
