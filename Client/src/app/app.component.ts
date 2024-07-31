import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RecruiterHomeComponent } from "./components/recruiter/recruiter-home/recruiter-home.component";
import { RecruiterProfileComponent } from "./components/recruiter/recruiter-profile/recruiter-profile.component";
import { CreateJobComponent } from "./components/recruiter/create-job/create-job.component";
import { HomeComponent } from "./components/candidate/home/home.component";
import { ApplyJobComponent } from "./components/candidate/apply-job/apply-job.component";
import { AppliedJobsComponent } from "./components/candidate/applied-jobs/applied-jobs.component";
import { ApplicationsComponent } from "./components/recruiter/applications/applications.component";
import { JobApplicantsComponent } from './components/recruiter/job-applicants/job-applicants.component';
import { UserApplicationListComponent } from "./components/admin/user-application-list/user-application-list.component";
import { ProfilePageComponent } from "./components/candidate/profile-page/profile-page.component";
import { InterviewsComponent } from "./components/recruiter/interviews/interviews.component";
import { RecruiterProfilePageComponent } from "./components/recruiter/recruiter-profile-page/recruiter-profile-page.component";
import { VideoCallComponent } from "./components/recruiter/video-call/video-call.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, RecruiterHomeComponent, RecruiterProfileComponent, CreateJobComponent, HomeComponent, ApplyJobComponent, AppliedJobsComponent, ApplicationsComponent, JobApplicantsComponent, UserApplicationListComponent, ProfilePageComponent, InterviewsComponent, RecruiterProfilePageComponent, VideoCallComponent, AppComponent,CommonModule]
})
export class AppComponent {
  title = 'Client';

  
}
