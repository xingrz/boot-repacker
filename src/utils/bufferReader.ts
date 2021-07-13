export default class BufferReader {

  private buffer: Buffer;
  private ptr: number;

  constructor(arrayBuffer: ArrayBuffer) {
    this.buffer = Buffer.from(arrayBuffer);
    this.ptr = 0;
  }

  read(count: number): Buffer {
    const buf = this.buffer.slice(this.ptr, this.ptr + count);
    this.ptr += count;
    return buf;
  }

  readUInt32LE(): number {
    const value = this.buffer.readUInt32LE(this.ptr);
    this.ptr += 4;
    return value;
  }

  readUInt64LE(): number {
    const value = this.buffer.readUInt32LE(this.ptr); // FIXME
    this.ptr += 8;
    return value;
  }

  reset(): void {
    this.ptr = 0;
  }

  tell(): number {
    return this.ptr;
  }

}
