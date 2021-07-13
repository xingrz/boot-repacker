export default function readFile(file: File): Promise<ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => resolve(new Uint8Array(evt.target?.result as ArrayBuffer));
    reader.onabort = () => resolve(null);
    reader.onerror = (evt) => reject(evt);
    reader.readAsArrayBuffer(file);
  });
}
