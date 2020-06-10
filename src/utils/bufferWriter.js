import { Buffer } from 'buffer';

export default class BufferWriter {

  constructor(size) {
    this.buffer = Buffer.alloc(size, 0x00);
    this.ptr = 0;
  }

  write(buf) {
    buf.copy(this.buffer, this.ptr);
    this.ptr += buf.length;
  }

  writeUInt32LE(value) {
    this.buffer.writeUInt32LE(value, this.ptr);
    this.ptr += 4;
  }

  writeUInt64LE(value) {
    this.buffer.writeUInt32LE(value, this.ptr); // FIXME
    this.ptr += 8;
    return value;
  }

  skip(count) {
    this.ptr += count;
  }

  tell() {
    return this.ptr;
  }

}
