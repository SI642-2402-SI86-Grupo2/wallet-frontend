export class Users {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  photo: Uint8Array | null;

  constructor(user_id: number, first_name: string, last_name: string, email: string, password: string, photo: Uint8Array | null = null) {
    this.user_id = user_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.photo = photo;
  }
}
