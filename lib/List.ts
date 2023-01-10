type ListNode<T> = { value: T; next?: ListNode<T>; prev?: ListNode<T> };

export class List<T = never> {
  #head?: ListNode<T> = undefined;
  #tail?: ListNode<T> = undefined;
  length = 0;

  constructor(iterable = [] as Iterable<T>) {
    this.length = 0;
    this.pushTail(...iterable);
  }

  #buildList(list: T[]) {
    let h: ListNode<T> | undefined;
    let t: ListNode<T> | undefined;
    let l = 0;

    for (const v of list) {
      const n: ListNode<T> = { value: v };
      if (h === undefined) {
        h = n;
      }
      if (t) {
        t.next = n;
        n.prev = t;
      }
      l += 1;
      t = n;
    }

    return { h, t, l };
  }

  pushTail(...items: T[]) {
    if (items.length > 0) {
      const { h, t, l } = this.#buildList(items);
      if (this.#tail) {
        this.#tail.next = h;
        (h as ListNode<T>).prev = this.#tail;
      } else {
        this.#head = h;
      }
      this.#tail = t;
      this.length += l;
    }
  }

  pushHead(...items: T[]) {
    if (items.length > 0) {
      const { h, t, l } = this.#buildList(items);
      if (this.#head) {
        this.#head.prev = t;
        (t as ListNode<T>).next = this.#head;
      } else {
        this.#tail = t;
      }
      this.#head = h;
      this.length += l;
    }
  }

  popHead(): T | undefined {
    if (this.#head) {
      const value = this.#head.value;
      this.#head = this.#head.next;
      if (this.#head === undefined) {
        this.#tail = undefined;
      } else {
        this.#head.prev = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  popTail(): T | undefined {
    if (this.#tail) {
      const value = this.#tail.value;
      this.#tail = this.#tail.prev;
      if (this.#tail === undefined) {
        this.#head = undefined;
      } else {
        this.#tail.next = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  get(index: number): ListNode<T> {
    if (index < 0) index = this.length + index;
    if (index < 0 || index >= this.length) {
      throw new Error("out of bounds error");
    } else if (!Number.isInteger(index)) {
      throw new TypeError("index must be an integer");
    } else {
      if (index > this.length >> 1) {
        let curr = this.#tail as ListNode<T>;
        for (let i = this.length - 1; i > index; i--) {
          curr = (curr as ListNode<T>).prev as ListNode<T>;
        }
        return curr;
      } else {
        let curr = this.#head as ListNode<T>;
        for (let i = 0; i < index; i++) {
          curr = (curr as ListNode<T>).next as ListNode<T>;
        }
        return curr;
      }
    }
  }

  splice(startIndex: number, deleteCount = 0, ...items: T[]): T[] {
    let currNode: ListNode<T> | undefined =
      startIndex === this.length ? undefined : this.get(startIndex);
    const prevNode: ListNode<T> | undefined = currNode?.prev;

    const removedValues: T[] = [];
    for (let i = 0; i < deleteCount && currNode !== undefined; i++) {
      if (prevNode === undefined) {
        this.popHead();
        removedValues.push(currNode.value);
      } else {
        if (currNode.next === undefined) {
          this.popTail();
        } else {
          currNode.next.prev = prevNode;
          prevNode.next = currNode.next;
          this.length -= 1;
        }
        removedValues.push(currNode.value);
      }
      currNode = currNode.next;
    }

    if (currNode === undefined) {
      this.pushTail(...items);
    } else if (prevNode === undefined) {
      this.pushHead(...items);
    } else if (items.length > 0) {
      const { h, t, l } = this.#buildList(items);
      prevNode.next = h;
      (h as ListNode<T>).prev = prevNode;
      currNode.prev = t;
      (t as ListNode<T>).next = currNode;
      this.length += l;
    }

    return removedValues;
  }

  get head(): T | undefined {
    return this.#head?.value;
  }

  get tail(): T | undefined {
    return this.#tail?.value;
  }

  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
