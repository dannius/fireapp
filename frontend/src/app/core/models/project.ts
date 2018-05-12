import { Environment } from '@app/core/models/environment';

export class Project {

  public static fromJson({ id, owner_id, owner_login, name, archived, environments }): Project {
    return new Project(
      +id,
      owner_id,
      owner_login,
      name,
      archived,
      environments ? environments.map((env) => Environment.fromJson(env)) : []
    );
  }

  public static empty(): Project {
    return new Project(null, null, '', '', false);
  }

  constructor(
    public id: number,
    public ownerId: number,
    public ownerLogin: string,
    public name: string,
    public archived: boolean,
    public environments?: Environment[]
  ) { }
}
