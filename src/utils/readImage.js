import readFile from './readFile';

export default async function readImage(image, part) {
  if (part instanceof File) {
    return await readFile(part);
  } else if (part && typeof part.offset == 'number' && typeof part.size == 'number') {
    return image.slice(part.offset, part.offset + part.size);
  } else {
    return null;
  }
}
