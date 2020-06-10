import { Buffer } from 'buffer';

import BufferWriter from './bufferWriter';
import numberOfPages from './numberOfPages';
import calculatePosition from './calculatePosition';
import readFile from './readFile';

const BOOT_IMAGE_HEADER_V1_SIZE = 1648
const BOOT_IMAGE_HEADER_V2_SIZE = 1660
const BOOT_MAGIC = Buffer.from('ANDROID!');

export default async function buildImage(source, initial, values, images) {
  const parts = await arrange(source, initial, values, images);
  const totalSize = caclulateTotalSize(parts, values.page_size);
  const buffer = new BufferWriter(totalSize);

  const img_id = await calculateImageId(parts);

  writeHeader(buffer, parts, values, img_id);

  writePart(buffer, parts.kernel, values.page_size);
  writePart(buffer, parts.ramdisk, values.page_size);
  writePart(buffer, parts.second, values.page_size);
  writePart(buffer, parts.dt, values.page_size);
  writePart(buffer, parts.recovery_dtbo, values.page_size);
  writePart(buffer, parts.dtb, values.page_size);

  return buffer.buffer;
}

function writeHeader(buffer, parts, values, img_id) {
  buffer.write(BOOT_MAGIC);

  buffer.writeUInt32LE(parts.kernel.size);
  buffer.writeUInt32LE(values.kernel_addr);
  buffer.writeUInt32LE(parts.ramdisk.size);
  buffer.writeUInt32LE(values.ramdisk_addr);
  buffer.writeUInt32LE(parts.second.size);
  buffer.writeUInt32LE(values.second_addr);
  buffer.writeUInt32LE(values.tags_addr);
  buffer.writeUInt32LE(values.page_size);

  if (parts.dt) {
    buffer.writeUInt32LE(parts.dt.size);
  } else {
    buffer.writeUInt32LE(values.header_version);
  }

  buffer.writeUInt32LE(calculateVersion(values.os_patch_level, values.os_version));

  const board = Buffer.alloc(16, 0x00);
  Buffer.from(values.board || '').copy(board);
  buffer.write(board);

  const cmdline = Buffer.alloc(512 + 1024, 0x00);
  Buffer.from(values.cmdline).copy(cmdline);
  buffer.write(cmdline.slice(0, 512));
  buffer.write(img_id);
  buffer.write(cmdline.slice(512));

  if (parts.recovery_dtbo) {
    const { size, offset } = parts.recovery_dtbo;
    buffer.writeUInt32LE(size);
    buffer.writeUInt64LE(size > 0 ? offset : 0);
  }

  if (values.header_version == 1) {
    buffer.writeUInt32LE(BOOT_IMAGE_HEADER_V1_SIZE);
  } else if (values.header_version == 2) {
    buffer.writeUInt32LE(BOOT_IMAGE_HEADER_V2_SIZE);
  }

  if (parts.dtb) {
    buffer.writeUInt32LE(parts.dtb.size);
    buffer.writeUInt64LE(values.dtb_addr);
  }

  padFile(buffer, values.page_size);
}

function writePart(buffer, part, page_size) {
  if (!part) return;

  if (part.buffer) {
    buffer.write(part.buffer);
  }

  padFile(buffer, page_size);
}

function padFile(buffer, page_size) {
  const size = buffer.tell();
  const size_paged = page_size * numberOfPages(size, page_size);
  buffer.skip(size_paged - size);
}

function calculateVersion(patch_level, version) {
  let bits = 0;

  if (version && version.match(/^(\d+)\.(\d+)\.(\d+)$/)) {
    const [a, b, c] = [parseInt(RegExp.$1), parseInt(RegExp.$2), parseInt(RegExp.$3)];
    if (a < 128 && b < 128 && c < 128) {
      const v = (a << 14) | (b << 7) | c;
      bits |= v << 11;
    }
  }

  if (patch_level && patch_level.match(/^(\d{4})-(\d{2})$/)) {
    const [y, m] = [parseInt(RegExp.$1) - 2000, parseInt(RegExp.$2)];
    if (y >= 0 && y < 128 && m > 0 && m <= 12) {
      const p = (y << 4) | m;
      bits |= p;
    }
  }

  return bits;
}

async function calculateImageId(parts) {
  const bufs = [];
  if (parts.kernel.buffer) {
    bufs.push(parts.kernel.buffer);
  }
  if (parts.ramdisk.buffer) {
    bufs.push(parts.ramdisk.buffer);
  }
  if (parts.second.buffer) {
    bufs.push(parts.second.buffer);
  }
  if (parts.dt && parts.dt.buffer) {
    bufs.push(parts.dt.buffer);
  }
  if (parts.recovery_dtbo && parts.recovery_dtbo.buffer) {
    bufs.push(parts.recovery_dtbo.buffer);
  }
  if (parts.dtb && parts.dtb.buffer) {
    bufs.push(parts.dtb.buffer);
  }

  const data = Buffer.concat(bufs);
  const digest = await crypto.subtle.digest('SHA-1', data.buffer);

  const img_id = Buffer.alloc(32, 0x00);
  Buffer.from(digest).copy(img_id);

  return img_id;
}

function caclulateTotalSize(parts, page_size) {
  let size = 1 * page_size; // header size
  for (const part in parts) {
    size += parts[part].size_paged;
  }
  return size;
}

async function arrange(source, initial, values, images) {
  const src = Buffer.from(source);
  const { header_version, page_size } = values;

  const names = ['kernel', 'ramdisk', 'second'];
  if (header_version == 0) {
    names.push('dt');
  }
  if (header_version > 0) {
    names.push('recovery_dtbo');
  }
  if (header_version > 1) {
    names.push('dtb');
  }

  const parts = {};
  let image_offset = 1 * page_size; // header size

  for (const part of names) {
    if (images[part] && images[part].removed) {
      parts[part] = {
        size_paged: 0,
        size: 0,
      };
    }
    if (images[part] && images[part].name)  {
      const size_paged = page_size * numberOfPages(images[part].size, page_size);
      parts[part] = {
        size_paged: size_paged,
        size: images[part].size,
        offset: image_offset,
        buffer: Buffer.from(await readFile(images[part])),
      };
      image_offset += size_paged;
    } else {
      const size_paged = page_size * numberOfPages(values[`${part}_size`], page_size);
      const { offset, size } = calculatePosition(part, initial);
      parts[part] = {
        size_paged: size_paged,
        size: size,
        offset: image_offset,
        buffer: Buffer.from(src.slice(offset, offset + size)),
      };
      image_offset += size_paged;
    }
  }

  return parts;
}
