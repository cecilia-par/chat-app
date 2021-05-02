//User Model
export class User {
  id: string;
  token: string;
  username: string | undefined;
  password: string | undefined;

  /**
   * Constructeur
   */
  public constructor(username?: string, password?: string) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.username = username;
    this.password = password;
    this.token = '';
  }
}
