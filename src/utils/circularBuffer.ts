// utils/circularBuffer.ts
export class CircularBuffer<T> {
    buffer: T[];
    pointer: number;
    size: number;
  
    constructor(size: number) {
      this.size = size;
      this.buffer = Array(size).fill(null) as T[];
      this.pointer = 0;
    }
  
    push(item: T) {
      this.buffer[this.pointer] = item;
      this.pointer = (this.pointer + 1) % this.size;
    }
  
    getBuffer(): T[] {
      return [...this.buffer];
    }
  }
  