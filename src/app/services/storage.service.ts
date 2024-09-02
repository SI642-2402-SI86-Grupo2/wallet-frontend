import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private userIdKey = 'loggedInUserId';

  setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }

  setTestUserId(): void {
    this.setUserId(1); // Assign a test user ID, e.g., 1
  }
}
