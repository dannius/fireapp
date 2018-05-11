export class Project {

  public static fromJson({ id, owner_id, owner_login, name, archived }): Project {
    return new Project(
      +id,
      owner_id,
      owner_login,
      name,
      archived
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
    public archived: boolean
  ) { }
}
