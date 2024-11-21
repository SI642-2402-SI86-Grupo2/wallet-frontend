export class Users {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  
    constructor(userId: number, firstName: string, lastName: string, email: string, photo: string) {
      this.userId = userId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.photo = photo;
    }
  }
  