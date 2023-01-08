import { List } from "./List.js";

test("List", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  list.push(1, 10, 5);
  expect(list.length).toBe(3);
  expect([...list.values()]).toMatchObject([1, 10, 5]);
  expect(list.shift()).toBe(1);
  expect([...list.values()]).toMatchObject([10, 5]);
  expect(list.length).toBe(2);
  expect(list.get(0)).toBe(10);
  expect(list.get(1)).toBe(5);
  expect(list.get(2)).toBe(undefined);
  expect(list.shift()).toBe(10);
  expect([...list.values()]).toMatchObject([5]);
  expect(list.push(11)).toBe(undefined);
  expect(list.push(9)).toBe(undefined);
  expect(list.remove(1)).toBe(11);
  expect(list.remove(1)).toBe(9);
  expect(list.remove(1)).toBe(undefined);
  expect(list.remove(0)).toBe(5);
  expect(list.remove(0)).toBe(undefined);
  expect([...list.values()]).toMatchObject([]);
  expect(list.length).toBe(0);
  expect([...list.values()]).toMatchObject([]);
  list.push(5, 10, 1);
  expect([...list.values()]).toMatchObject([5, 10, 1]);
  list.change(2, 2);
  expect(list.get(2)).toBe(2);
  expect([...list.values()]).toMatchObject([5, 10, 2]);
  expect(list.length).toBe(3);
  expect(list.pop()).toBe(2);
  expect(list.length).toBe(2);
  expect(list.shift()).toBe(5);
  expect(list.length).toBe(1);
  expect(list.shift()).toBe(10);
  list.push(10);
  expect(() => list.change(-1, 1)).toThrowError(
    /^Cannot change \(index=-1\) on List \(length=1\)$/
  );
  expect(list.pop()).toBe(10);
  expect(list.length).toBe(0);
  expect(list.pop()).toBe(undefined);
  expect(list.shift()).toBe(undefined);
  expect(list.length).toBe(0);
  expect([...list.values()]).toMatchObject([]);
});

test("List insert", () => {
  const list = new List<string>();
  expect(list.length).toBe(0);
  list.insert(0, "foo");
  list.insert(0, "bar");
  list.insert(1, "baz");
  expect(() => list.insert(4, "boo")).toThrow();
  expect([...list.values()]).toMatchObject(["bar", "baz", "foo"]);
});

test("List offset overflow", () => {
  const list = new List<number>();
  expect(list.length).toBe(0);
  list.push(...new Array(20).fill(0).map((_, i) => i));
  for (let i = 0; i <= 15; i++) list.shift();
  expect([...list.values()]).toMatchObject([16, 17, 18, 19]);
});
