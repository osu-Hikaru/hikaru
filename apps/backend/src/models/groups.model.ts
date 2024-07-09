import { DatabaseModel } from "./model.js";

import { Group } from "../classes/group.class.js";

export class GroupsModel extends DatabaseModel {
  private static instance: GroupsModel;
  private groups: Group[] = [];

  private constructor() {
    super();

    if (!GroupsModel.instance) {
      GroupsModel.instance = this;
    }

    return GroupsModel.instance;
  }

  public static getInstance(): GroupsModel {
    if (!GroupsModel.instance) {
      GroupsModel.instance = new GroupsModel();
    }
    return GroupsModel.instance;
  }

  public clearCache(): void {
    this.groups = [];
  }

  public getGroups(ids: Array<number>): Promise<Group[]> {
    const promises: Array<Promise<Group>> = [];

    ids.forEach((groupid) => {
      promises.push(this.fetchGroup(groupid));
    });

    return Promise.all(promises).then((groups) => {
      return groups;
    });
  }

  private async fetchGroup(id: number): Promise<Group> {
    return new Promise(async (resolve, reject) => {
      const lookupGroup = this.groups.find((group) => group.id === id);

      if (lookupGroup) {
        resolve(JSON.parse(lookupGroup.getObject()));
      } else {
        const dbService = this._databaseService.getClient();

        await dbService.groups
          .findFirstOrThrow({
            where: {
              id: id,
            },
          })
          .then((group) => {
            const newGroup = new Group();

            Object.keys(group).forEach((key) => {
              if (this.isValidKey(key, newGroup)) {
                (newGroup as any)[key] = (group as any)[key];
              }
            });
            this.groups.push(newGroup);
            resolve(JSON.parse(newGroup.getObject()));
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  private isValidKey(
    key: string | number | symbol,
    instance: any
  ): key is keyof typeof instance {
    return key in instance;
  }
}
