import { User } from '@app/core/models/user';
import { Project } from '@app/core/models/project';

export class ProjectWithUsers extends Project {

  public static fromJson({ id, owner_id, name, archived, users }): ProjectWithUsers {
    return new ProjectWithUsers(
      +id,
      owner_id,
      name,
      archived,
      users.map((user) => User.fromJson(user)) || []
    );
  }

  public static empty(): Project {
    return new ProjectWithUsers(null, null, '', false, []);
  }

  constructor(
    public id: number,
    public owner_id: number,
    public name: string,
    public archived: boolean,
    public users: User[]
  ) {
    super(id, owner_id, name, archived);
  }
}
