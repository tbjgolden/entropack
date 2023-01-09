import { List } from "./List.js";

test("List", () => {
  const list = new List<number>();
  for (let j = 0; j < 1000; j++) list.push(j);
  expect(list.at(30)).toBe(30);
  expect(list.at(0)).toBe(0);
  expect(() => list.at(0.5)).toThrow();
  expect(list.at(-1)).toBe(999);
  expect(() => list.at(1000)).toThrow;
});

// as queue 3:2
test("List as queue", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 6e4; j++) list.push(j);
  for (let j = 0; j < 4e4; j++) list.shift();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => 40_000 + i)
      .join(",")
  );
});

// as stack 3:2
test("List as stack", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 6e4; j++) list.push(j);
  for (let j = 0; j < 4e4; j++) list.pop();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => i)
      .join(",")
  );
});

// as reverse stack 3:2
test("List as reverse stack", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 6e4; j++) list.unshift(j);
  for (let j = 0; j < 4e4; j++) list.shift();
  expect(performance.now() - start).toBeLessThan(100);
  expect([...list].join(",")).toBe(
    new Array(20_000)
      .fill(0)
      .map((_, i) => 19_999 - i)
      .join(",")
  );
});

// as queue stack (grow from both sides, shrink from both sides) 1:2:1
test("List as queue stack", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 2e5; j++) {
    list.push(j);
    list.unshift(j);
  }
  for (let j = 0; j < 1e5; j++) {
    list.shift();
    list.pop();
  }
  for (let j = 0; j < 1e5; j += 5) {
    list.at(j);
  }
  expect(performance.now() - start).toBeLessThan(2000);
  expect([...list].join(",")).toEqual(
    new Array(100_000)
      .fill(0)
      .map((_, i) => 99_999 - i)
      .join(",") +
      "," +
      new Array(100_000)
        .fill(0)
        .map((_, i) => i)
        .join(",")
  );
});

test("List all", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  expect(list.shift()).toBe(undefined);
  expect(list.length).toBe(0);
  list.push(1, 10, 5);
  expect(list.length).toBe(3);
  expect([...list]).toEqual([1, 10, 5]);
  expect(list.shift()).toBe(1);
  expect([...list]).toEqual([10, 5]);
  expect(list.length).toBe(2);
  expect(list.at(0)).toBe(10);
  expect(list.at(1)).toBe(5);
  expect(() => list.at(2)).toThrow();
  expect(list.shift()).toBe(10);
  expect([...list]).toEqual([5]);
  expect(list.push(11)).toBe(undefined);
  expect(list.push(9)).toBe(undefined);
  expect(list.splice(1, 1)).toEqual([11]);
  expect(list.splice(1, 1)).toEqual([9]);
  expect(() => list.splice(1, 1)).toThrow();
  expect(list.splice(0, 1)).toEqual([5]);
  expect(() => list.splice(0, 1)).toThrow();
  expect([...list]).toEqual([]);
  expect(list.length).toBe(0);
  expect([...list]).toEqual([]);
  list.push(5, 10, 1);
  expect([...list]).toEqual([5, 10, 1]);
  list.set(2, 2);
  expect(list.at(2)).toBe(2);
  expect([...list]).toEqual([5, 10, 2]);
  expect(list.length).toBe(3);
  expect(list.pop()).toBe(2);
  expect(list.length).toBe(2);
  expect(list.shift()).toBe(5);
  expect(list.length).toBe(1);
  expect(list.shift()).toBe(10);
  list.push(10);
  list.set(-1, 4);
  expect(list.at(-1)).toBe(4);
  expect(list.pop()).toBe(4);
  expect(list.length).toBe(0);
  expect(list.pop()).toBe(undefined);
  expect(list.shift()).toBe(undefined);
  expect(list.length).toBe(0);
  expect([...list]).toEqual([]);
});

test("List insert", () => {
  const list = new List<string>();
  expect(list.length).toBe(0);
  list.splice(0, 0, "foo");
  list.splice(0, 0, "bar");
  list.splice(1, 0, "baz");
  expect(() => list.splice(4, 0, "boo")).toThrow();
  expect([...list]).toEqual(["bar", "baz", "foo"]);
});

test("List insert shift if sublist full", () => {
  const list = new List<string>();
  expect(list.length).toBe(0);
  list.splice(0, 0, "foo");
  for (let i = 0; i < 201; i++) {
    list.splice(1, 0, "baz" + i);
  }
  expect(list.at(0)).toBe("foo");
  expect(list.at(1)).toBe("baz200");
  expect(list.at(149)).toBe("baz52");
  expect(list.at(150)).toBe("baz51");
  expect(list.at(151)).toBe("baz50");
  expect(list.at(201)).toBe("baz0");
});

test("List remove will autoremove sublist", () => {
  const list = new List<string>();
  expect(list.length).toBe(0);
  list.splice(0, 0, "foo");
  list.splice(1, 0, "baz");
  list.splice(1, 0, "bar");
  expect([...list]).toEqual(["foo", "bar", "baz"]);
  list.splice(2, 1);
  expect([...list]).toEqual(["foo", "bar"]);
  list.splice(1, 1);
  expect([...list]).toEqual(["foo"]);
  list.splice(0, 1);
  expect([...list]).toEqual([]);
  expect(() => list.at(1)).toThrow();
  list.push("boi");
  expect([...list]).toEqual(["boi"]);
});

test("List remove at sublist start will use buffer", () => {
  const arr = new Array(102).fill(0).map((_, i) => i);
  const list = new List(arr);
  expect(list.length).toBe(102);
  expect([...list]).toEqual(arr);
  expect(list.splice(100, 1)).toEqual([100]);
});

test("List offset overflow", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  list.push(...new Array(20).fill(0).map((_, i) => i));
  for (let i = 0; i <= 15; i++) list.shift();
  expect([...list]).toEqual([16, 17, 18, 19]);
});
