import React from 'react';
import { Space, Button, Popconfirm } from 'antd';
import type { ButtonProps } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

interface ActionItem {
  type?: 'view' | 'edit' | 'delete' | 'custom';
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  confirm?: boolean;
  confirmTitle?: string;
  confirmOkText?: string;
  confirmCancelText?: string;
  disabled?: boolean;
  visible?: boolean;
  buttonProps?: ButtonProps;
}

interface TableActionProps {
  actions?: ActionItem[];
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const TableAction: React.FC<TableActionProps> = ({
  actions = [],
  onView,
  onEdit,
  onDelete,
  showView = false,
  showEdit = false,
  showDelete = false,
}) => {
  const renderAction = (action: ActionItem, index: number) => {
    const {
      type,
      label,
      icon,
      onClick,
      confirm = false,
      confirmTitle = '确认删除',
      confirmOkText = '确定',
      confirmCancelText = '取消',
      disabled = false,
      visible = true,
      buttonProps = {},
    } = action;

    if (!visible) return null;

    const defaultIcons = {
      view: <EyeOutlined />,
      edit: <EditOutlined />,
      delete: <DeleteOutlined />,
    };

    const defaultLabels = {
      view: '查看',
      edit: '编辑',
      delete: '删除',
    };

    const content = (
      <Button
        type="link"
        size="small"
        icon={icon || (type ? defaultIcons[type] : null)}
        disabled={disabled}
        {...buttonProps}
        onClick={onClick}
      >
        {label || (type ? defaultLabels[type] : null)}
      </Button>
    );

    if (confirm) {
      return (
        <Popconfirm
          key={index}
          title={confirmTitle}
          onConfirm={onClick}
          okText={confirmOkText}
          cancelText={confirmCancelText}
        >
          {content}
        </Popconfirm>
      );
    }

    return <span key={index}>{content}</span>;
  };

  const defaultActions: ActionItem[] = [
    ...(showView
      ? [
          {
            type: 'view' as const,
            onClick: onView,
          },
        ]
      : []),
    ...(showEdit
      ? [
          {
            type: 'edit' as const,
            onClick: onEdit,
          },
        ]
      : []),
    ...(showDelete
      ? [
          {
            type: 'delete' as const,
            onClick: onDelete,
            confirm: true,
          },
        ]
      : []),
  ];

  const allActions = [...defaultActions, ...actions];

  return (
    <Space size="small">
      {allActions.map((action, index) => renderAction(action, index))}
    </Space>
  );
};

export default TableAction;
