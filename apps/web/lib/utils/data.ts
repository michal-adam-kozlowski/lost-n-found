export function paginate<T>(
  items: T[],
  page?: number,
  pageSize = 20,
): { items: T[]; pageCount: number; totalCount: number } {
  if (!page) return { items, pageCount: 1, totalCount: items.length };
  const pageCount = Math.ceil(items.length / pageSize);
  return { items: items.slice((page - 1) * pageSize, page * pageSize), pageCount, totalCount: items.length };
}
