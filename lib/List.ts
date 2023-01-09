type ListNode<T> = { v: T; n?: ListNode<T>; p?: ListNode<T> };

type SubList<T> = {
  o: number;
  s: Array<ListNode<T> | undefined>;
};

const SUB_SIZE = 200;
const SUB_HALF_SIZE = 100;
const SUB_BUFFER = 50;

export class List<T = never> {
  #head?: ListNode<T> = undefined;
  #tail?: ListNode<T> = undefined;
  #subLists: SubList<T>[] = [];
  length: number;

  constructor(iterable = [] as Iterable<T>) {
    let p: ListNode<T> | undefined;
    let subList: SubList<T> = undefined as unknown as SubList<T>;
    let length = 0;
    for (const v of iterable) {
      const node: ListNode<T> = { v, p };
      if (p) {
        p.n = node;
      } else {
        this.#head = node;
      }
      p = node;
      if (length % SUB_HALF_SIZE === 0) {
        subList = { o: SUB_BUFFER, s: new Array(SUB_BUFFER).fill(void 0) };
        this.#subLists.push(subList);
      }
      subList.s.push(node);
      length += 1;
    }
    this.#tail = p;
    this.length = length;
  }

  #ensureSubListExists() {
    if (this.#subLists.length === 0) {
      this.#subLists.push({
        o: SUB_BUFFER,
        s: new Array(SUB_BUFFER).fill(void 0),
      });
    }
  }

  #getLastSubListForPush() {
    this.#ensureSubListExists();
    let lastSubList = this.#subLists[this.#subLists.length - 1];
    if (lastSubList.s.length + lastSubList.o >= SUB_SIZE) {
      lastSubList = {
        o: SUB_BUFFER,
        s: new Array(SUB_BUFFER).fill(void 0),
      };
      this.#subLists.push(lastSubList);
    }
    return lastSubList;
  }

  #push(v: T) {
    const node: ListNode<T> = { v };
    {
      if (this.#head === undefined) {
        this.#head = node;
      }
      if (this.#tail) {
        this.#tail.n = node;
        node.p = this.#tail;
      }
      this.length += 1;
      this.#tail = node;
    }
    {
      this.#getLastSubListForPush().s.push(node);
    }
  }

  #unshift(v: T) {
    const node: ListNode<T> = { v };
    {
      if (this.#tail === undefined) {
        this.#tail = node;
      }
      if (this.#head) {
        this.#head.p = node;
        node.n = this.#head;
      }
      this.length += 1;
      this.#head = node;
    }
    {
      const lastSubList = this.#getFirstSubListForUnshift();
      lastSubList.s[--lastSubList.o] = node;
    }
  }

  #getFirstSubListForUnshift() {
    this.#ensureSubListExists();
    let firstSubList = this.#subLists[0];
    if (firstSubList.o === 0) {
      firstSubList = {
        o: SUB_BUFFER,
        s: new Array(SUB_BUFFER).fill(void 0),
      };
      this.#subLists.unshift(firstSubList);
    }
    return firstSubList;
  }

  #indexToLocation(index: number): [number, number] {
    if (index < 0) index = this.length + index;
    if (Number.isInteger(index)) {
      if (index >= this.length) {
        throw new Error("out of bounds error");
      } else {
        let len = 0;
        let i = 0;
        let subList;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line security/detect-object-injection
          subList = this.#subLists[i];
          len += subList.s.length - subList.o;
          if (index < len) {
            return [i, subList.s.length - (len - index)];
          }
          i += 1;
        }
      }
    } else {
      throw new TypeError("index must be an integer");
    }
  }

  #getByLocation(location: [number, number]): ListNode<T> {
    return this.#subLists[location[0]].s[location[1]] as ListNode<T>;
  }

  #insert(index: number, v: T) {
    if (index === this.length) {
      this.#push(v);
    } else if (index === 0) {
      this.#unshift(v);
    } else {
      const location = this.#indexToLocation(index);
      const nextItem = this.#getByLocation(location);
      const item: ListNode<T> = { v, p: nextItem.p, n: nextItem };
      {
        const prevItem = item.p as ListNode<T>;
        prevItem.n = item;
        nextItem.p = item;
      }
      const subList = this.#subLists[location[0]];
      {
        subList.s.splice(location[1], 0, item);
      }
      if (subList.o + subList.s.length > SUB_SIZE) {
        if (subList.o > 0) {
          // sublist too big, shift left using offset
          subList.s.shift();
          subList.o -= 1;
        } else {
          // sublist too big, split in two
          this.#subLists.splice(
            location[0],
            1,
            {
              o: SUB_BUFFER,
              s: [...new Array(SUB_BUFFER).fill(void 0), ...subList.s.slice(0, SUB_HALF_SIZE)],
            },
            {
              o: SUB_BUFFER,
              s: [...new Array(SUB_BUFFER).fill(void 0), ...subList.s.slice(SUB_HALF_SIZE)],
            }
          );
        }
      }
      this.length += 1;
    }
  }

  #remove(index: number): T {
    const location = this.#indexToLocation(index);
    const item = this.#getByLocation(location);
    {
      if (item.p) {
        item.p.n = item.n;
      } else {
        this.#head = item.n;
      }
      if (item.n) {
        item.n.p = item.p;
      } else {
        this.#tail = item.p;
      }
    }
    {
      const subList = this.#subLists[location[0]];
      if (subList.s.length === subList.o + 1) {
        this.#subLists.splice(location[0], 1);
      } else if (location[1] === subList.o) {
        subList.s[subList.o++] = undefined;
      } else {
        subList.s.splice(location[1], 1);
      }
    }
    this.length -= 1;
    return item.v;
  }

  push(...values: T[]) {
    for (const value of values) {
      this.#push(value);
    }
  }

  unshift(...values: T[]) {
    for (const value of values) {
      this.#unshift(value);
    }
  }

  pop(): T | undefined {
    if (this.#tail) {
      const value = this.#tail.v;
      {
        this.#tail = this.#tail.p;
        if (this.#tail === undefined) {
          this.#head = undefined;
        } else {
          this.#tail.n = undefined;
        }
      }
      {
        this.#ensureSubListExists();
        const lastSubList = this.#subLists[this.#subLists.length - 1];
        lastSubList.s.pop();
      }
      this.length -= 1;
      return value;
    }
  }

  shift(): T | undefined {
    if (this.#head) {
      const value = this.#head.v;
      {
        this.#head = this.#head.n;
        if (this.#head === undefined) {
          this.#tail = undefined;
        } else {
          this.#head.p = undefined;
        }
      }
      {
        this.#ensureSubListExists();
        if (this.#subLists[0].o >= SUB_SIZE) {
          this.#subLists[0] = {
            o: SUB_BUFFER,
            s: new Array(SUB_BUFFER).fill(void 0),
          };
        }
        this.#subLists[0].s[this.#subLists[0].o++] = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  at(index: number): T {
    return this.#getByLocation(this.#indexToLocation(index)).v;
  }

  set(index: number, value: T) {
    this.#getByLocation(this.#indexToLocation(index)).v = value;
  }

  splice(index: number, deleteCount = 0, ...items: T[]): T[] {
    const removed: T[] = new Array(deleteCount);
    for (let i = 0; i < deleteCount; i++) {
      // eslint-disable-next-line security/detect-object-injection
      removed[i] = this.#remove(index);
    }
    for (let i = items.length - 1; i >= 0; i--) {
      // eslint-disable-next-line security/detect-object-injection
      this.#insert(index, items[i]);
    }
    return removed;
  }

  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.v;
      current = current.n;
    }
  }
}
