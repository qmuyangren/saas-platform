import React from 'react';
import { Table as AntdTable } from 'antd';
import type { TableProps } from 'antd';

interface BasicTableProps<T = any> extends TableProps<T> {
  loading?: boolean;
}

function BasicTable<T extends object = any>({
  loading = false,
  ...props
}: BasicTableProps<T>) {
  return (
    <AntdTable
      {...props}
      loading={loading}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        ...props.pagination,
      }}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff' }}
    />
  );
}

export default BasicTable;
