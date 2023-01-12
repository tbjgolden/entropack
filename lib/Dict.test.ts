import { Dict } from "./Dict.js";

test("Dict", () => {
  const dict = new Dict({
    hi: "world",
    x: 4,
    a: true,
    he: "he",
    s: undefined,
    aa: ["who", 3, {}, false, undefined, [-1]],
    b: {
      hello: "bye",
    },
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
