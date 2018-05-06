export class Project {

  public static fromJson({ id, name, owner_id }): Project {
    return new Project(
      +id,
      owner_id,
      name
    );
  }

  public static empty(): Project {
    return new Project(null, null, '');
  }

  constructor(
    public id: number,
    public owner_id: number,
    public name: string
  ) { }
}
