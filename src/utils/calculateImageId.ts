import readImage from './readImage';
import { IImageMeta } from './parseImage';

export default async function calculateImageId(image: ArrayBuffer, meta: IImageMeta): Promise<Buffer> {
  const bufs: Buffer[] = [];

  await append(bufs, image, meta.kernel as File);
  await append(bufs, image, meta.ramdisk as File);
  await append(bufs, image, meta.second as File);
  if (meta.header_version == 0) {
    await append(bufs, image, meta.dt as File);
  }
  if (meta.header_version > 0) {
    await append(bufs, image, meta.recovery_dtbo as File);
  }
  if (meta.header_version > 1) {
    await append(bufs, image, meta.dtb as File);
  }

  const data = Buffer.concat(bufs);
  const digest = await crypto.subtle.digest('SHA-1', data.buffer);

  const img_id = Buffer.alloc(32, 0x00);
  Buffer.from(digest).copy(img_id);

  return img_id;
}

async function append(bufs: Buffer[], image: ArrayBuffer, part: File | null): Promise<void> {
  const buf = await readImage(image, part) as Buffer;
  if (buf) {
    if (buf.length > 0) {
      bufs.push(Buffer.from(buf));
    }
    bufs.push(bufferFromUInt32LE(buf.length));
  } else {
    bufs.push(bufferFromUInt32LE(0));
  }
}

function bufferFromUInt32LE(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value);
  return buf;
}
