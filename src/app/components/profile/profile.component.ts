import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    userId: 0
  };
  token: string | null = '';
  photoUrl: string = '';

  constructor(
    private profileService: ProfileService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.storageService.getUserId();
    if (userId) {
      this.token = this.storageService.getToken();
      console.log('User ID:', userId); // Log the user ID for debugging
      console.log('Token:', this.token); // Log the token for debugging
      this.profileService.getProfileByUserId(userId).subscribe(data => {
        this.profile = data;
      });
    } else {
      console.error('User ID not found in storage');
    }
  }

  updatePhotoUrl(): void {
    if (this.photoUrl) {
      const payload = { photo: this.photoUrl };

      this.profileService.uploadProfilePhoto(this.profile.userId, payload).subscribe(response => {
        console.log('Photo updated successfully', response);
        this.loadProfile(); // Refresh the profile data
      }, error => {
        console.error('Error updating photo', error);
      });
    }
  }

  saveProfile(): void {
    this.profileService.updateProfile(this.profile).subscribe(response => {
      console.log('Profile updated successfully', response);
    }, error => {
      console.error('Error updating profile', error);
    });
  }
}
