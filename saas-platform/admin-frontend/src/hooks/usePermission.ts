import { usePermissionStore } from '@/stores/permission.store';

interface UsePermissionReturn {
  permissions: string[];
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
  hasAllPermissions: (codes: string[]) => boolean;
}

/**
 * 权限 Hook
 */
export const usePermission = (): UsePermissionReturn => {
  const { permissions } = usePermissionStore();

  const hasPermission = (code: string): boolean => {
    return permissions?.includes(code) ?? false;
  };

  const hasAnyPermission = (codes: string[]): boolean => {
    return codes.some(code => permissions?.includes(code) ?? false);
  };

  const hasAllPermissions = (codes: string[]): boolean => {
    return codes.every(code => permissions?.includes(code) ?? false);
  };

  return {
    permissions: permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
