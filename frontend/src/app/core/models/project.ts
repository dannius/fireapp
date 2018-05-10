export class Project {

  public static fromJson({ id, name, owner_id, archived }): Project {
    return new Project(
      +id,
      owner_id,
      name,
      archived
    );
  }

  public static empty(): Project {
    return new Project(null, null, '', false);
  }

  constructor(
    public id: number,
    public ownerId: number,
    public name: string,
    public archived: boolean
  ) { }
}
