import BufferWriter from './bufferWriter';
import readImage from './readImage';
import numberOfPages from './numberOfPages';
import { IImageMeta, IImagePartName } from './parseImage';

const PARTS: IImagePartName[] = ['kernel', 'ramdisk', 'second', 'dt', 'recovery_dtbo', 'dtb'];

export default async function buildImage(source: ArrayBuffer, values: IImageMeta): Promise<Buffer> {
  const totalSize = caclulateTotalSize(values);
  const buffer = new BufferWriter(totalSize);

  writeHeader(buffer, values);

  for (const part of PARTS) {
    await writePart(buffer, source, values[part] as File, values.page_size);
  }

  return buffer.buffer;
}

function writeHeader(buffer: BufferWriter, values: IImageMeta): void {
  buffer.write(Buffer.from(values.magic));

  buffer.writeUInt32LE(values.kernel_size);
  buffer.writeUInt32LE(values.kernel_addr);
  buffer.writeUInt32LE(values.ramdisk_size);
  buffer.writeUInt32LE(values.ramdisk_addr);
  buffer.writeUInt32LE(values.second_size);
  buffer.writeUInt32LE(values.second_addr);
  buffer.writeUInt32LE(values.tags_addr);
  buffer.writeUInt32LE(values.page_size);

  if (values.dt_size > 0) {
    buffer.writeUInt32LE(values.dt_size);
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

  const img_id = Buffer.alloc(32, 0x00);
  Buffer.from(values.img_id, 'hex').copy(img_id);
  buffer.write(img_id);

  buffer.write(cmdline.slice(512));

  if (values.header_version > 0) {
    buffer.writeUInt32LE(values.recovery_dtbo_size);
    buffer.writeUInt64LE(values.recovery_dtbo_offset);
  }

  if (values.header_version > 0) {
    buffer.writeUInt32LE(values.header_size || 0);
  }

  if (values.header_version > 1) {
    buffer.writeUInt32LE(values.dtb_size);
    buffer.writeUInt64LE(values.dtb_addr);
  }

  padFile(buffer, values.page_size);
}

async function writePart(buffer: BufferWriter, image: ArrayBuffer, part: File | null, page_size: number): Promise<void> {
  const buf = await readImage(image, part);
  if (buf) {
    buffer.write(Buffer.from(buf));
    padFile(buffer, page_size);
  }
}

function padFile(buffer: BufferWriter, page_size: number): void {
  const size = buffer.tell();
  const size_paged = page_size * numberOfPages(size, page_size);
  buffer.skip(size_paged - size);
}

function calculateVersion(patch_level: string, version: string): number {
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

function caclulateTotalSize(values: IImageMeta): number {
  let pages = 1; // header
  for (const part of PARTS) {
    pages += numberOfPages((values as unknown as Record<string, number>)[`${part}_size`], values.page_size);
  }
  return pages * values.page_size;
}
