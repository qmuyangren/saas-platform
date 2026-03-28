import React from 'react';
import { Tree as AntdTree } from 'antd';
import type { TreeProps as AntdTreeProps, DataNode } from 'antd';

interface TreeDataNode extends DataNode {
  key: string;
  title: string;
  children?: TreeDataNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
  disableCheckbox?: boolean;
}

interface TreeProps extends Omit<AntdTreeProps, 'treeData'> {
  treeData?: TreeDataNode[];
  showIcon?: boolean;
  showLine?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  blockNode?: boolean;
}

const Tree: React.FC<TreeProps> = ({
  treeData = [],
  showIcon = false,
  showLine = false,
  checkable = false,
  selectable = true,
  blockNode = false,
  ...props
}) => {
  return (
    <AntdTree
      {...props}
      treeData={treeData}
      showIcon={showIcon}
      showLine={showLine}
      checkable={checkable}
      selectable={selectable}
      blockNode={blockNode}
    />
  );
};

export default Tree;
export type { TreeDataNode };
