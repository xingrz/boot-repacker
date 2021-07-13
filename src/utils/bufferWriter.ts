export default class BufferWriter {

  public buffer: Buffer;
  private ptr: number;

  constructor(size: number) {
    this.buffer = Buffer.alloc(size, 0x00);
    this.ptr = 0;
  }

  write(buf: Buffer): void {
    buf.copy(this.buffer, this.ptr);
    this.ptr += buf.length;
  }

  writeUInt32LE(value: number): void {
    this.buffer.writeUInt32LE(value, this.ptr);
    this.ptr += 4;
  }

  writeUInt64LE(value: number): void {
    this.buffer.writeUInt32LE(value, this.ptr); // FIXME
    this.ptr += 8;
  }

  skip(count: number): void {
    this.ptr += count;
  }

  tell(): number {
    return this.ptr;
  }

}
