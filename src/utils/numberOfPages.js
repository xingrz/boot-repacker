export default function numberOfPages(imageSize, pageSize) {
  return Math.floor((imageSize + pageSize - 1) / pageSize);
}
