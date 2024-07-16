import { Component } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-profile-page',
  standalone: true,
  imports: [FooterComponent, RecruiterSidebarComponent, RecruiterHeaderComponent,CommonModule],
  templateUrl: './recruiter-profile-page.component.html',
  styleUrl: './recruiter-profile-page.component.scss'
})
export class RecruiterProfilePageComponent {
  profile: any;

    constructor(
        private recruiterService: RecruiterService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        const id = localStorage.getItem('recruiter_id');
        if (id) {
            this.recruiterService.getProfile(id).subscribe(profile => {
                this.profile = profile;
            });
        }
    }

    editProfile(): void {
        this.router.navigate(['/recruiter/edit-profile']);
    }
}
