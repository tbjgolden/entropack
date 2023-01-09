type ListNode<T> = {
  value: T;
  next?: ListNode<T>;
  prev?: ListNode<T>;
};

type SubList<T> = {
  offset: number;
  items: Array<ListNode<T> | undefined>;
};

const SUB_SIZE = 200;
const SUB_HALF_SIZE = 100;
const SUB_BUFFER = 50;

export class List<T> {
  #head?: ListNode<T> = undefined;
  #tail?: ListNode<T> = undefined;
  #subLists: SubList<T>[] = [];

  length = 0;

  #ensureSubListExists() {
    if (this.#subLists.length === 0) {
      this.#subLists.push({
        offset: SUB_BUFFER,
        items: new Array(SUB_BUFFER).fill(void 0),
      });
    }
  }

  #getLastSubListForPush() {
    this.#ensureSubListExists();
    let lastSubList = this.#subLists[this.#subLists.length - 1];
    if (lastSubList.items.length + lastSubList.offset >= SUB_SIZE) {
      lastSubList = {
        offset: SUB_BUFFER,
        items: new Array(SUB_BUFFER).fill(void 0),
      };
      this.#subLists.push(lastSubList);
    }
    return lastSubList;
  }

  #push(value: T) {
    const node: ListNode<T> = { value };
    {
      if (this.#head === undefined) {
        this.#head = node;
      }
      if (this.#tail) {
        this.#tail.next = node;
        node.prev = this.#tail;
      }
      this.length += 1;
      this.#tail = node;
    }
    {
      this.#getLastSubListForPush().items.push(node);
    }
  }

  #unshift(value: T) {
    const node: ListNode<T> = { value };
    {
      if (this.#tail === undefined) {
        this.#tail = node;
      }
      if (this.#head) {
        this.#head.prev = node;
        node.next = this.#head;
      }
      this.length += 1;
      this.#head = node;
    }
    {
      const lastSubList = this.#getFirstSubListForUnshift();
      lastSubList.items[--lastSubList.offset] = node;
    }
  }

  #getFirstSubListForUnshift() {
    this.#ensureSubListExists();
    let firstSubList = this.#subLists[0];
    if (firstSubList.offset === 0) {
      firstSubList = {
        offset: SUB_BUFFER,
        items: new Array(SUB_BUFFER).fill(void 0),
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
          len += subList.items.length - subList.offset;
          if (index < len) {
            return [i, subList.items.length - (len - index)];
          }
          i += 1;
        }
      }
    } else {
      throw new TypeError("index must be an integer");
    }
  }

  #getByLocation(location: [number, number]): ListNode<T> {
    return this.#subLists[location[0]].items[location[1]] as ListNode<T>;
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
      const value = this.#tail.value;
      {
        this.#tail = this.#tail.prev;
        if (this.#tail === undefined) {
          this.#head = undefined;
        } else {
          this.#tail.next = undefined;
        }
      }
      {
        this.#ensureSubListExists();
        const lastSubList = this.#subLists[this.#subLists.length - 1];
        lastSubList.items.pop();
      }
      this.length -= 1;
      return value;
    }
  }

  shift(): T | undefined {
    if (this.#head) {
      const value = this.#head.value;
      {
        this.#head = this.#head.next;
        if (this.#head === undefined) {
          this.#tail = undefined;
        } else {
          this.#head.prev = undefined;
        }
      }
      {
        this.#ensureSubListExists();
        if (this.#subLists[0].offset >= SUB_SIZE) {
          this.#subLists[0] = {
            offset: SUB_BUFFER,
            items: new Array(SUB_BUFFER).fill(void 0),
          };
        }
        this.#subLists[0].items[this.#subLists[0].offset++] = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  at(index: number): T {
    return this.#getByLocation(this.#indexToLocation(index)).value;
  }

  set(index: number, value: T) {
    this.#getByLocation(this.#indexToLocation(index)).value = value;
  }

  insert(index: number, value: T) {
    if (index === this.length) {
      this.#push(value);
    } else if (index === 0) {
      this.#unshift(value);
    } else {
      const location = this.#indexToLocation(index);
      const nextItem = this.#getByLocation(location);
      const item = { value, prev: nextItem.prev, next: nextItem };
      {
        const prevItem = item.prev as ListNode<T>;
        prevItem.next = item;
        nextItem.prev = item;
      }
      const subList = this.#subLists[location[0]];
      {
        subList.items.splice(location[1], 0, item);
      }
      if (subList.offset + subList.items.length > SUB_SIZE) {
        if (subList.offset > 0) {
          // sublist too big, shift left using offset
          subList.items.shift();
          subList.offset -= 1;
        } else {
          // sublist too big, split in two
          this.#subLists.splice(
            location[0],
            1,
            {
              offset: SUB_BUFFER,
              items: [
                ...new Array(SUB_BUFFER).fill(void 0),
                ...subList.items.slice(0, SUB_HALF_SIZE),
              ],
            },
            {
              offset: SUB_BUFFER,
              items: [...new Array(SUB_BUFFER).fill(void 0), ...subList.items.slice(SUB_HALF_SIZE)],
            }
          );
        }
      }
      this.length += 1;
    }
  }

  remove(index: number): T {
    const location = this.#indexToLocation(index);
    const item = this.#getByLocation(location);
    {
      if (item.prev) {
        item.prev.next = item.next;
      } else {
        this.#head = item.next;
      }
      if (item.next) {
        item.next.prev = item.prev;
      } else {
        this.#tail = item.prev;
      }
    }
    {
      const subList = this.#subLists[location[0]];
      if (subList.items.length === subList.offset + 1) {
        this.#subLists.splice(location[0], 1);
      } else if (location[1] === subList.offset) {
        subList.items[subList.offset++] = undefined;
      } else {
        subList.items.splice(location[1], 1);
      }
    }
    this.length -= 1;
    return item.value;
  }

  *values() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
