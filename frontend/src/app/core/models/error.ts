import { User } from '@app/core/models/user';

export class Error {

  public static fromJson({ id, name, user, description, counter, updated_at, inserted_at }): Error {
    return new Error(
      +id,
      name,
      description,
      counter,
      user ? User.fromJson(user) : null,
      updated_at,
      inserted_at
    );
  }

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public counter: number,
    public user: User,
    public updatedAt: string,
    public insertedAt: string
  ) {
    this.updatedAt = this.formatTime(updatedAt);
    this.insertedAt = this.formatTime(insertedAt);
  }

  private formatTime(iso: string): string {
    const date = new Date(iso);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const timeString =  `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yy = date.getFullYear();

    const dateString = `${dd < 10 ? `0${dd}` : dd}-${mm < 10 ? `0${mm}` : mm}-${yy}`;

    return `${dateString} ${timeString}`;
  }
}
