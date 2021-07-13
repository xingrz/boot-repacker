export default function numberOfPages(imageSize: number, pageSize: number): number {
  return Math.floor((imageSize + pageSize - 1) / pageSize);
}
