import readFile from './readFile';
import { IImagePart } from './parseImage';

export default async function readImage(image: ArrayBuffer, part: File | IImagePart | null): Promise<Buffer | ArrayBuffer | null> {
  if (part instanceof File) {
    return await readFile(part);
  } else if (part && typeof part.offset == 'number' && typeof part.size == 'number') {
    return image.slice(part.offset, part.offset + part.size);
  } else {
    return null;
  }
}
