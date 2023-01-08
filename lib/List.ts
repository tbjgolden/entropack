export type ListNode<T> = {
  value: T;
  next?: ListNode<T>;
  prev?: ListNode<T>;
};

export class List<T> {
  #head?: ListNode<T> = undefined;
  #tail?: ListNode<T> = undefined;
  #array: Array<ListNode<T> | undefined> = [];
  #offset = 0;

  #push(value: T) {
    const node: ListNode<T> = { value };
    if (this.#head === undefined) {
      this.#head = node;
    }
    if (this.#tail) {
      this.#tail.next = node;
      node.prev = this.#tail;
    }
    this.#tail = node;
    this.#array.push(node);
  }

  push(...values: T[]) {
    for (const value of values) this.#push(value);
  }

  pop(): T | undefined {
    if (this.#tail) {
      const value = this.#tail.value;
      this.#tail = this.#tail.prev;
      if (this.#tail === undefined) {
        this.#head = undefined;
      } else {
        this.#tail.next = undefined;
      }
      this.#array.pop();
      return value;
    }
  }

  shift(): T | undefined {
    if (this.#head) {
      const value = this.#head.value;
      this.#head = this.#head.next;
      if (this.#head === undefined) {
        this.#tail = undefined;
      } else {
        this.#head.prev = undefined;
      }
      this.#array[this.#offset++] = undefined;

      // remove leading undefineds when offset crosses a threshold
      if (this.#offset > 10 + this.length) {
        this.#array.splice(0, this.#offset);
        this.#offset = 0;
      }
      return value;
    }
  }

  get(index: number): T | undefined {
    return this.#array[index + this.#offset]?.value;
  }

  change(index: number, value: T): void {
    if (index < 0 || index >= this.length) {
      throw new Error(`Cannot change (index=${index}) on List (length=${this.length})`);
    } else {
      const node = this.#array[index + this.#offset] as ListNode<T>;
      node.value = value;
    }
  }

  insert(index: number, value: T): void {
    if (index < 0 || index > this.length) {
      throw new Error(`Cannot insert at (index=${index}) on List (length=${this.length})`);
    } else {
      const nextNode = this.#array[index + this.#offset];
      const node = { value, prev: nextNode?.prev, next: nextNode };
      this.#array.splice(index + this.#offset, 0, node);
      if (nextNode) {
        if (nextNode.prev) {
          nextNode.prev.next = node;
        } else {
          this.#head = node;
        }
        nextNode.prev = node;
      } else {
        this.#tail = node;
      }
      node.value = value;
    }
  }

  remove(index: number): T | undefined {
    const removedValue = this.#array.splice(index + this.#offset, 1)[0];
    if (removedValue) {
      if (removedValue.prev) {
        removedValue.prev.next = removedValue.next;
      } else {
        this.#head = removedValue.next;
      }
      if (removedValue.next) {
        removedValue.next.prev = removedValue.prev;
      } else {
        this.#tail = removedValue.prev;
      }
      return removedValue.value;
    }
  }

  get length(): number {
    return this.#array.length - this.#offset;
  }

  *values() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
