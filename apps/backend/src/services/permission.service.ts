export class PermissionService {
  private static instance: PermissionService;

  private static groups_admin: number[] = [1];

  private constructor() {
    if (!PermissionService.instance) {
      PermissionService.instance = this;
    }

    return PermissionService.instance;
  }

  public static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  public static checkPermission(
    groups: number[],
    requiredLevel: string
  ): boolean {
    switch (requiredLevel) {
      case "admin":
        if (groups.some((group) => this.groups_admin.includes(group))) {
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
  }
}
