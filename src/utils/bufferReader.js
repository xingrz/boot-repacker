import { Buffer } from 'buffer';

export default class BufferReader {

  constructor(arrayBuffer) {
    this.buffer = Buffer.from(arrayBuffer);
    this.ptr = 0;
  }

  read(count) {
    const buf = this.buffer.slice(this.ptr, this.ptr + count);
    this.ptr += count;
    return buf;
  }

  readUInt32LE() {
    const value = this.buffer.readUInt32LE(this.ptr);
    this.ptr += 4;
    return value;
  }

  readUInt64LE() {
    const value = this.buffer.readUInt32LE(this.ptr); // FIXME
    this.ptr += 8;
    return value;
  }

  reset() {
    this.ptr = 0;
  }

}
