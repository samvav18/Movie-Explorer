//Small helpers (Debounce, formatting)
export const getPageNumbers = (current, total, delta = 2) => {
  const pages = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    }
  }

  return pages.reduce((acc, page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) acc.push('...');
    acc.push(page);
    return acc;
  }, []);
};