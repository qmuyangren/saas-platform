import React from 'react';
import { Table as AntdTable } from 'antd';
import type { TableProps as AntdTableProps } from 'antd';
import { useTable } from '../hooks/useTable';
import TableAction from '../TableAction';

interface TableProps<T = any> extends Omit<AntdTableProps<T>, 'dataSource' | 'loading'> {
  remote?: boolean;
  fetchData?: (params: any) => Promise<{ list: T[]; total: number }>;
  onAction?: (action: string, record: T) => void;
}

function BasicTable<T extends object = any>({
  remote = false,
  fetchData,
  onAction,
  columns = [],
  ...props
}: TableProps<T>) {
  const { loading, dataSource, pagination, handleTableChange } = useTable<T>({
    remote,
    fetchData,
    pagination: props.pagination,
  });

  // 添加操作列
  const columnsWithAction = React.useMemo(() => {
    if (!onAction) return columns;

    const actionColumn = {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: T) => (
        <TableAction
          showView
          showEdit
          showDelete
          onView={() => onAction('view', record)}
          onEdit={() => onAction('edit', record)}
          onDelete={() => onAction('delete', record)}
        />
      ),
    };

    return [...columns, actionColumn];
  }, [columns, onAction]);

  return (
    <AntdTable
      {...props}
      loading={loading}
      dataSource={dataSource}
      columns={columnsWithAction}
      pagination={pagination}
      onChange={handleTableChange}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff' }}
    />
  );
}

export default BasicTable;
