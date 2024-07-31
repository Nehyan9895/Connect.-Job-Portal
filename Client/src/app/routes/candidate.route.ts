import { Routes } from "@angular/router";
import { LandingPageComponent } from "../components/shared/landing_page/landing-page.component";
import { LoginComponent } from "../components/candidate/login/login.component";
import { SignupComponent } from "../components/shared/signup/signup.component";
import { OtpPageComponent } from "../components/shared/otp-page/otp-page.component";
import { UserPersonalProfileComponent } from "../components/candidate/user-personal-profile/user-personal-profile.component";
import { HomeComponent } from "../components/candidate/home/home.component";
import { userAuthGuard } from "../guard/user-auth.guard";
import { ForgetPasswordComponent } from "../components/shared/forget-password/forget-password.component";
import { ChangePasswordComponent } from "../components/shared/change-password/change-password.component";
import path from "path";
import { ApplyJobComponent } from "../components/candidate/apply-job/apply-job.component";
import { userFalseAuth } from "../guard/user-false-auth.guard";
import { AppliedJobsComponent } from "../components/candidate/applied-jobs/applied-jobs.component";
import { ProfilePageComponent } from "../components/candidate/profile-page/profile-page.component";
import { ChatComponent } from "../components/candidate/chat/chat.component";

export const candidateRoute : Routes = [
    {
        path:'landing_page',
        component: LandingPageComponent,
        canActivate:[userFalseAuth]
    },
    {
        path:'',
        component: LandingPageComponent,
        canActivate:[userFalseAuth]

    },
    {
        path:'candidate/login',
        component:LoginComponent,
        canActivate:[userFalseAuth]
    },
    {
        path:'candidate/signup',
        component:SignupComponent
    },
    {
        path:'candidate/otp-page',
        component:OtpPageComponent
    },
    {
        path:'candidate/add-profile',
        component:UserPersonalProfileComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'candidate/profile',
        component:ProfilePageComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'candidate/home',
        component:HomeComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'candidate/forgot-password',
        component:ForgetPasswordComponent
    },
    {
        path:'candidate/reset-password',
        component:ChangePasswordComponent
    },
    {
        path:'candidate/apply-job',
        component:ApplyJobComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'candidate/applied-jobs',
        component:AppliedJobsComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'candidate/messages',
        component:ChatComponent,
        canActivate:[userAuthGuard]
    },
    
]