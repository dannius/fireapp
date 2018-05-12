import { User } from '@app/core/models/user';
import { Project } from '@app/core/models/project';
import { Environment } from '@app/core/models/environment';

export class ProjectWithUsers extends Project {

  public static fromJson({ id, owner_id, owner_login, name, sdk_key, archived, users, environments }): ProjectWithUsers {
    return new ProjectWithUsers(
      +id,
      +owner_id,
      owner_login,
      name,
      sdk_key,
      archived,
      users.map((user) => User.fromJson(user)) || [],
      environments
    );
  }

  public static empty(): Project {
    return new ProjectWithUsers(null, null, '', '', '', false, [], []);
  }

  constructor(
    public id: number,
    public ownerId: number,
    public ownerLogin: string,
    public name: string,
    public sdkKey: string,
    public archived: boolean,
    public users: User[],
    public environments?: Environment[]
  ) {
    super(id, ownerId, ownerLogin, name, archived, environments || []);
  }
}
