import { IImageMeta, IImagePart, IImagePartName } from "./parseImage";

export default function exportImage(image: ArrayBuffer, meta: IImageMeta, part: IImagePartName): ArrayBuffer {
  const { offset, size } = meta[part] as IImagePart;
  return image.slice(offset, offset + size);
}
