import { Routes } from "@angular/router";
import { RecruiterLoginComponent } from "../components/recruiter/recruiter-login/recruiter-login.component";
import { RecruiterHomeComponent } from "../components/recruiter/recruiter-home/recruiter-home.component";
import { recruiterAuthGuard } from "../guard/recruiter-auth.guard";
import { RecruiterProfileComponent } from "../components/recruiter/recruiter-profile/recruiter-profile.component";
import { CreateJobComponent } from "../components/recruiter/create-job/create-job.component";
import { EditJobComponent } from "../components/recruiter/edit-job/edit-job.component";
import { MessagesComponent } from "../components/recruiter/messages/messages.component";
import { recruiterFalseAuthGuard } from "../guard/recruiter-false-auth.guard";
import { JobApplicantsComponent } from "../components/recruiter/job-applicants/job-applicants.component";
import { ApplicationsComponent } from "../components/recruiter/applications/applications.component";
import { RecruiterProfilePageComponent } from "../components/recruiter/recruiter-profile-page/recruiter-profile-page.component";
import { InterviewsComponent } from "../components/recruiter/interviews/interviews.component";
import { VideoCallComponent } from "../components/recruiter/video-call/video-call.component";

export const recruiterRoute : Routes = [
    {
        path:'recruiter/login',
        component:RecruiterLoginComponent,
        canActivate:[recruiterFalseAuthGuard]
    },
    {
        path:'recruiter/home',
        component:RecruiterHomeComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/profile',
        component:RecruiterProfilePageComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/add-profile',
        component:RecruiterProfileComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/create-job',
        component:CreateJobComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/edit-job',
        component:EditJobComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path: 'recruiter/chat/:id',
        component: MessagesComponent,
        canActivate: [recruiterAuthGuard]
    },
    {
        path:'recruiter/applications',
        component:ApplicationsComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/applicants',
        component:JobApplicantsComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/chat/:recruiterId/:candidateId',
        component:MessagesComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'recruiter/interviews',
        component:InterviewsComponent,
        canActivate:[recruiterAuthGuard]
    },
    {
        path:'video-call',
        component:VideoCallComponent,
    }
]