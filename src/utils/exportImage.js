import calculatePosition from './calculatePosition';

export default function extractImage(image, meta, part) {
  const { offset, size } = calculatePosition(part, meta);
  return image.slice(offset, offset + size);
}
