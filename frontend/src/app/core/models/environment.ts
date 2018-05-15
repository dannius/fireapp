export class Environment {

  public static fromJson({ id, name }): Environment {
    return new Environment(
      id,
      name
    );
  }

  public static empty(): Environment {
    return new Environment(null, '');
  }

  constructor(
    public id: number,
    public name: string
  ) { }
}
