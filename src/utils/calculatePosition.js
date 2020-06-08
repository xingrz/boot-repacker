import numberOfPages from './numberOfPages';

export default function calculatePosition(part, meta) {
  const parts = [];

  function offset() {
    let pages = 1;
    for (const size of parts) {
      pages += numberOfPages(size, meta.page_size);
    }
    return pages * meta.page_size;
  }

  if (part == 'kernel') {
    return { offset: offset(), size: meta.kernel_size };
  }

  parts.push(meta.kernel_size);

  if (part == 'ramdisk') {
    return { offset: offset(), size: meta.ramdisk_size };
  }

  parts.push(meta.ramdisk_size);

  if (part == 'second') {
    return { offset: offset(), size: meta.second_size };
  }

  parts.push(meta.second_size);

  if (part == 'dt') {
    return { offset: offset(), size: meta.dt_size };
  }

  parts.push(meta.dt_size);

  if (part == 'recovery_dtbo') {
    return { offset: offset(), size: meta.recovery_dtbo_size };
  }

  parts.push(meta.recovery_dtbo_size);

  if (part == 'dtb') {
    return { offset: offset(), size: meta.dtb_size };
  }
}
