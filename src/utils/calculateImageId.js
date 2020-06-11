import { Buffer } from 'buffer';

import readImage from './readImage';

export default async function calculateImageId(image, meta) {
  const bufs = [];

  await append(bufs, image, meta.kernel);
  await append(bufs, image, meta.ramdisk);
  await append(bufs, image, meta.second);
  if (meta.header_version == 0) {
    await append(bufs, image, meta.dt);
  }
  if (meta.header_version > 0) {
    await append(bufs, image, meta.recovery_dtbo);
  }
  if (meta.header_version > 1) {
    await append(bufs, image, meta.dtb);
  }

  const data = Buffer.concat(bufs);
  const digest = await crypto.subtle.digest('SHA-1', data.buffer);

  const img_id = Buffer.alloc(32, 0x00);
  Buffer.from(digest).copy(img_id);

  return img_id;
}

async function append(bufs, image, part) {
  const buf = await readImage(image, part);
  if (buf) {
    if (buf.length > 0) {
      bufs.push(Buffer.from(buf));
    }
    bufs.push(bufferFromUInt32LE(buf.length));
  } else {
    bufs.push(bufferFromUInt32LE(0));
  }
}

function bufferFromUInt32LE(value) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value);
  return buf;
}
