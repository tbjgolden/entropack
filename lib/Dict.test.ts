import { Dict } from "./Dict.js";

test("Dict", () => {
  const dict = new Dict({
    hi: "world",
    x: 4,
    a: true,
    he: "he",
    s: undefined,
    aa: ["who", 3, {}, false, [-1]],
    b: {
      hello: "banana",
    },
  });
  expect(dict.toString()).toBe(`  a: true
  aa: who,3,,false,-1
  b:   hello: banana
  he: he
  hi: world
  x: 4`);
});
