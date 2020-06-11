export default function exportImage(image, meta, part) {
  const { offset, size } = meta[part];
  return image.slice(offset, offset + size);
}
