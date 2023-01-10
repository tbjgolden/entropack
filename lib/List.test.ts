import { List } from "./List.js";

test("List", () => {
  const list1 = new List<number>();
  list1.pushHead();
  list1.pushHead(-1);
  expect(list1.head).toBe(-1);
  expect(list1.tail).toBe(-1);
  expect(list1.popHead()).toBe(-1);
  expect(list1.head).toBe(undefined);
  expect(list1.tail).toBe(undefined);
  expect(list1.popHead()).toBe(undefined);
  expect(list1.popTail()).toBe(undefined);
  list1.pushTail();
  list1.pushTail(-2);
  expect(list1.popTail()).toBe(-2);
  list1.pushTail(0, 1, 2);
  const list2 = new List<number>();
  list2.pushHead(0, 1, 2);
  expect([...list1]).toEqual([...list2]);
  list1.pushHead(...list2);
  expect([...list1]).toEqual([...list2, ...list2]);
});

// as queue 3:2
test("List as queue", () => {
  const start = performance.now();
  const list = new List<number>();
  for (let j = 0; j < 6e4; j++) list.pushTail(j);
  for (let j = 0; j < 4e4; j++) list.popHead();
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
  for (let j = 0; j < 6e4; j++) list.pushTail(j);
  for (let j = 0; j < 4e4; j++) list.popTail();
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
  for (let j = 0; j < 6e4; j++) list.pushHead(j);
  for (let j = 0; j < 4e4; j++) list.popHead();
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
    list.pushTail(j);
    list.pushHead(j);
  }
  for (let j = 0; j < 1e5; j++) {
    list.popTail();
    list.popHead();
  }
  expect(performance.now() - start).toBeLessThan(1000);
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
