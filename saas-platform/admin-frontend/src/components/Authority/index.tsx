import React from 'react';
import { usePermission } from '@/hooks';

interface AuthorityProps {
  code?: string;
  codes?: string[];
  mode?: 'all' | 'any';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限组件
 * 
 * @example
 * // 单个权限
 * <Authority code="user:add">
 *   <Button>添加用户</Button>
 * </Authority>
 * 
 * // 多个权限 (满足任一)
 * <Authority codes={['user:add', 'user:edit']} mode="any">
 *   <Button>操作</Button>
 * </Authority>
 * 
 * // 多个权限 (全部满足)
 * <Authority codes={['user:add', 'user:edit']} mode="all">
 *   <Button>操作</Button>
 * </Authority>
 */
const Authority: React.FC<AuthorityProps> = ({
  code,
  codes,
  mode = 'any',
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  const hasAccess = React.useMemo(() => {
    if (code) {
      return hasPermission(code);
    }

    if (codes) {
      return mode === 'all' ? hasAllPermissions(codes) : hasAnyPermission(codes);
    }

    return false;
  }, [code, codes, mode, hasPermission, hasAnyPermission, hasAllPermissions]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default Authority;
