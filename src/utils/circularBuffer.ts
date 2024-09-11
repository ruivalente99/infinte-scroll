// utils/circularBuffer.js
export class CircularBuffer {
    constructor(size) {
      this.size = size;
      this.buffer = Array(size).fill(null);
      this.pointer = 0;
    }
  
    push(item) {
      this.buffer[this.pointer] = item;
      this.pointer = (this.pointer + 1) % this.size;
    }
  
    getBuffer() {
      return [...this.buffer];
    }
  }
  