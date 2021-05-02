import { User } from './user';

//Message model
export class Message {
  id: string;
  user!: User;
  message: string;
  time: Date;

  /**
   * Constructeur
   */
  public constructor(message: string, user: User) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.user = user;
    this.message = message;
    this.time = new Date();
  }
}
