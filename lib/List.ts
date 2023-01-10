type ListNode<T> = { v: T; n?: ListNode<T>; p?: ListNode<T> };

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
      const n: ListNode<T> = { v };
      if (h === undefined) {
        h = n;
      }
      if (t) {
        t.n = n;
        n.p = t;
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
        this.#tail.n = h;
        (h as ListNode<T>).p = this.#tail;
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
        this.#head.p = t;
        (t as ListNode<T>).n = this.#head;
      } else {
        this.#tail = t;
      }
      this.#head = h;
      this.length += l;
    }
  }

  popHead(): T | undefined {
    if (this.#head) {
      const value = this.#head.v;
      this.#head = this.#head.n;
      if (this.#head === undefined) {
        this.#tail = undefined;
      } else {
        this.#head.p = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  popTail(): T | undefined {
    if (this.#tail) {
      const value = this.#tail.v;
      this.#tail = this.#tail.p;
      if (this.#tail === undefined) {
        this.#head = undefined;
      } else {
        this.#tail.n = undefined;
      }
      this.length -= 1;
      return value;
    }
  }

  get head(): T | undefined {
    return this.#head?.v;
  }

  get tail(): T | undefined {
    return this.#tail?.v;
  }

  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.v;
      current = current.n;
    }
  }
}
