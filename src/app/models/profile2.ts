export class Users {
    fullName: string;
    email: string;
    photo: string;
    userId: number;
  
    constructor(fullName: string, email: string, photo: string, userId: number) {
      this.fullName = fullName;
      this.email = email;
      this.photo = photo;
      this.userId = userId;
    }
  }
  