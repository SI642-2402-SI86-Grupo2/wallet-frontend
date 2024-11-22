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
  selectedFile: File | null = null;

  constructor(
    private profileService: ProfileService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    const userId = this.storageService.getUserId();
    if (userId) {
      this.token = this.storageService.getToken(); // Assume you have a method to get the token
      this.profileService.getProfileByUserId(userId).subscribe(data => {
        this.profile = data;
      });
    } else {
      console.error('User ID not found in storage');
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.photo = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.uploadPhoto();
    }
  }

  uploadPhoto(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('photo', this.selectedFile, this.selectedFile.name);

      this.profileService.uploadProfilePhoto(this.profile.userId, formData).subscribe(response => {
        this.profile.photo = response.photoUrl;
        console.log('Photo uploaded successfully', response);
      });
    }
  }

  saveProfile(): void {
    this.profileService.updateProfile(this.profile).subscribe(response => {
      console.log('Profile updated successfully', response);
    });
  }
}
