import { User } from '@app/core/models/user';
import { Project } from '@app/core/models/project';

export class ProjectWithUsers extends Project {

  public static fromJson({ id, name, users }): ProjectWithUsers {
    return new ProjectWithUsers(
      +id,
      name,
      users.map((user) => User.fromJson(user)) || []
    );
  }

  public static empty(): Project {
    return new ProjectWithUsers(null, '', []);
  }

  constructor(
    public id: number,
    public name: string,
    public users: User[]
  ) {
    super(id, name);
  }
}
