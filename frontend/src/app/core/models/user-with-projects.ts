import { Project } from '@app/core/models/project';
import { User } from '@app/core/models/user';

export class UserWithProject extends User {

  public static fromJson({ id, email, name, projects }): UserWithProject {
    return new UserWithProject(
      +id,
      email,
      name,
      projects.map((project) => Project.fromJson(project)) || []
    );
  }

  public static empty(): UserWithProject {
    return new UserWithProject(null, '', '', []);
  }

  constructor(
    public id: number,
    public email: string,
    public name: string,
    public projects: Project[]
  ) {
    super(id, email, name);
  }
}
