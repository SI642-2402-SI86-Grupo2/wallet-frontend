import { Component } from '@angular/core';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private storageService: StorageService) {}

  login(userId: number): void {
    this.storageService.setUserId(userId);
    // Redirect to another page or perform other actions after login
  }
}
