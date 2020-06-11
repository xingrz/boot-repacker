import { Buffer } from 'buffer';
import BufferReader from './bufferReader';
import numberOfPages from './numberOfPages';

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
    meta.header_size = null;
  }

  if (meta.header_version > 1) {
    meta.dtb_size = buf.readUInt32LE();
    meta.dtb_addr = buf.readUInt64LE();
  } else {
    meta.dtb_size = 0;
    meta.dtb_addr = 0;
  }

  let offset = buf.tell();
  offset = nextPage(offset, meta.page_size);

  meta.kernel = { offset, size: meta.kernel_size };
  offset = nextPage(offset + meta.kernel_size, meta.page_size);

  meta.ramdisk = { offset, size: meta.ramdisk_size };
  offset = nextPage(offset + meta.ramdisk_size, meta.page_size);

  if (meta.second_size > 0) {
    meta.second = { offset, size: meta.second_size };
    offset = nextPage(offset + meta.second_size, meta.page_size);
  } else {
    meta.second = null;
  }

  if (meta.dt_size > 0) {
    meta.dt = { offset, size: meta.dt_size };
    offset = nextPage(offset + meta.dt_size, meta.page_size);
  } else {
    meta.dt = null;
  }

  if (meta.recovery_dtbo_size > 0) {
    if (meta.recovery_dtbo_offset != offset) {
      throw new Error('Mismatch recovery_dtbo_offset!');
    }

    meta.recovery_dtbo = { offset, size: meta.recovery_dtbo_size };
    offset = nextPage(offset + meta.recovery_dtbo_size, meta.page_size);
  } else {
    meta.recovery_dtbo = null;
  }

  if (meta.dtb_size > 0) {
    meta.dtb = { offset, size: meta.dtb_size };
    offset = nextPage(offset + meta.dtb_size, meta.page_size);
  } else {
    meta.dtb = null;
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

function nextPage(offset, page_size) {
  return page_size * numberOfPages(offset, page_size);
}
