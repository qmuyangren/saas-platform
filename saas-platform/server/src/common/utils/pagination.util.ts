/**
 * 分页参数
 */
export interface PageQuery {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 创建分页响应
 */
export function createPageResponse<T>(
  list: T[],
  page: number,
  pageSize: number,
  total: number,
): PageResponse<T> {
  return {
    list,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
