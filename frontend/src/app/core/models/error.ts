import { User } from '@app/core/models/user';

export class Error {

  public static fromJson({ id, name, user, description, couter, updated_at, inserted_at }): Error {
    return new Error(
      +id,
      name,
      description,
      couter,
      user ? User.fromJson(user) : null,
      new Date(updated_at),
      new Date(inserted_at)
    );
  }

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public couter: number,
    public user: User,
    public updatedAt: Date,
    public insertedAt: Date
  ) { }
}
