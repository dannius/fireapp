export class User {

  public static fromJson({ id, email, name }): User {
    return new User(+id, email, name);
  }

  public static empty(): User {
    return new User(null, '', '');
  }

  constructor(
    public id: number,
    public email: string,
    public name: string,
  ) { }
}
