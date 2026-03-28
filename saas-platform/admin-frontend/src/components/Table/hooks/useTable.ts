import { useState, useCallback } from 'react';

interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number) => string;
}

interface UseTableOptions<T = any> {
  dataSource?: T[];
  pagination?: PaginationConfig;
  remote?: boolean;
  fetchData?: (params: any) => Promise<{ list: T[]; total: number }>;
}

interface UseTableReturn<T = any> {
  loading: boolean;
  dataSource: T[];
  pagination: PaginationConfig;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  setDataSource: (data: T[]) => void;
  setPagination: (pagination: PaginationConfig) => void;
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
}

/**
 * 表格 Hook
 */
export const useTable = <T = any>(options: UseTableOptions<T> = {}): UseTableReturn<T> => {
  const { remote = false, fetchData } = options;
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<T[]>(options.dataSource || []);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
    ...options.pagination,
  });

  const loadData = useCallback(async () => {
    if (!remote || !fetchData) return;

    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      const result = await fetchData(params);
      setDataSource(result.list);
      setPagination((prev) => ({
        ...prev,
        total: result.total,
      }));
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [remote, fetchData, pagination.current, pagination.pageSize]);

  const reload = useCallback(async () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    await loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const handleTableChange = useCallback(
    (newPagination: any) => {
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      }));

      if (remote && fetchData) {
        const params = {
          page: newPagination.current,
          pageSize: newPagination.pageSize,
        };
        fetchData(params).then((result) => {
          setDataSource(result.list);
          setPagination((prev) => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: result.total,
          }));
        });
      }
    },
    [remote, fetchData]
  );

  // 初始加载
  useState(() => {
    if (remote && fetchData) {
      loadData();
    }
  });

  return {
    loading,
    dataSource,
    pagination,
    reload,
    refresh,
    setDataSource,
    setPagination,
    handleTableChange,
  };
};
