import { Buffer } from 'buffer';
import BufferReader from './bufferReader';

const MAGIC = 'ANDROID!';

export default function parseImage(array) {
  let tmp;

  const meta = {};
  const buf = new BufferReader(array);

  meta.magic = buf.read(8).toString();
  if (meta.magic != MAGIC) {
    throw new Error('Invalid magic!');
  }

  meta.kernel_size = buf.readUInt32LE();
  meta.kernel_addr = buf.readUInt32LE();
  meta.ramdisk_size = buf.readUInt32LE();
  meta.ramdisk_addr = buf.readUInt32LE();
  meta.second_size = buf.readUInt32LE();
  meta.second_addr = buf.readUInt32LE();
  meta.tags_addr = buf.readUInt32LE();
  meta.page_size = buf.readUInt32LE();

  tmp = buf.readUInt32LE();

  if (tmp > 2) {
    meta.dt_size = tmp;
    meta.header_version = 0;
  } else {
    meta.dt_size = 0;
    meta.header_version = tmp;
  }

  tmp = buf.readUInt32LE();

  meta.os_patch_level = (() => {
    const bits = tmp & parseInt('11111111111', 2);
    const m = bits & parseInt('1111', 2);
    const y = (bits >> 4) + 2000;
    return `${y}-${m.toString().padStart(2, '0')}`;
  })();

  meta.os_version = (() => {
    const bits = tmp >> 11;
    const a = bits >> 14;
    const b = (bits >> 7) & parseInt('1111111', 2);
    const c = bits & parseInt('1111111', 2);
    return `${a}.${b}.${c}`;
  })();

  meta.board = buf.read(16).toString();

  const cmdline = Buffer.alloc(512 + 1024);
  buf.read(512).copy(cmdline, 0);

  meta.img_id = buf.read(32).toString('hex');

  buf.read(1024).copy(cmdline, 512);
  meta.cmdline = toString(cmdline);

  if (meta.header_version > 0) {
    meta.recovery_dtbo_size = buf.readUInt32LE();
    meta.recovery_dtbo_offset = buf.readUInt64LE();
  } else {
    meta.recovery_dtbo_size = 0;
    meta.recovery_dtbo_offset = 0;
  }

  if (meta.header_version > 0) {
    meta.header_size = buf.readUInt32LE();
  } else {
    meta.header_size = 1632;
  }

  if (meta.header_version > 1) {
    meta.dtb_size = buf.readUInt32LE();
    meta.dtb_addr = buf.readUInt64LE();
  } else {
    meta.dtb_size = 0;
    meta.dtb_addr = 0;
  }

  return meta;
}

function toString(buf) {
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] == 0) {
      return buf.slice(0, i).toString();
    }
  }
  return buf.toString();
}
