import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  token: string = '';

  constructor(private profileService: ProfileService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.token = this.authService.getToken(); // Asume que tienes un método para obtener el token
    this.profileService.getProfileByUserId(userId).subscribe(data => {
      this.profile = data;
    });
  }

  saveProfile(): void {
    this.profileService.updateProfile(this.profile).subscribe(response => {
      console.log('Profile updated successfully', response);
    });
  }
}
