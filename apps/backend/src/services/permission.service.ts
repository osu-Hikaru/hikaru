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

  public static checkPermission(groups: number[], requiredLevel: string) {
    switch (requiredLevel) {
      case "admin":
        return new Promise((resolve, reject) => {
          if (groups.some((group) => this.groups_admin.includes(group))) {
            resolve(true);
          } else {
            reject(false);
          }
        });
        break;
    }
  }
}
