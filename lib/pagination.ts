export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export function getPaginationParams(query: any): PaginationParams {
  return {
    page: Math.max(1, parseInt(query.page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(query.limit) || 20)),
    cursor: query.cursor,
  };
}

export function createPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    limit,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    nextCursor: page * limit < total ? Buffer.from(`page:${page + 1}`).toString('base64') : undefined,
    prevCursor: page > 1 ? Buffer.from(`page:${page - 1}`).toString('base64') : undefined,
  };
}
