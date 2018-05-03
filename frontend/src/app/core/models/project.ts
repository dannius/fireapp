export class Project {

  public static fromJson({ id, name }): Project {
    return new Project(
      +id,
      name
    );
  }

  public static empty(): Project {
    return new Project(null, '');
  }

  constructor(
    public id: number,
    public name: string
  ) { }
}
