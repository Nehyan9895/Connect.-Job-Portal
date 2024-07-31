import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { HomeJob, Job, JobForApplication, JobPosting, RawJobData } from '../models/job.model';
import { ForgetResponse, JobApplicationStatistics, JobApplyResponse, LoginResponse, ProfileResponse, ResendOtpResponse, ResponseModel, SignupResponse, UserDetails, VerifyForgetResponse, VerifyOtpResponse } from '../models/userResponseModel';
import { BasicCandidateData, CandidateData, Education, ExperienceData } from '../models/candidateData.interface';
import { Sender } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class userService {

  private token: string | null = null;
  private jwtHelper = new JwtHelperService();
  private apiKey = environment.userApiKey

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object){  }

  logout():void{
    this.token = null;
    localStorage.removeItem('userToken');
    this.router.navigate(['/candidate/login'])
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.token) {
        this.token = localStorage.getItem('userToken');
      }
    }
    return this.token;
  }
  

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const isTrue =  token ? !this.jwtHelper.isTokenExpired(token) : false;
      console.log(isTrue);
      return isTrue
      
    }
    return false;  // default to not logged in if not in browser context
  }





  signup(data:object):Observable<ResponseModel<SignupResponse>>{
    return this.http.post<ResponseModel<SignupResponse>>(`${this.apiKey}/signup`,data)
  }

  verifyOtp(otp: string, token: string): Observable<ResponseModel<VerifyOtpResponse>> {

    const body = { otp,token }; 
    return this.http.post<ResponseModel<VerifyOtpResponse>>(`${this.apiKey}/verify-otp`, body);
  }

  resendOtp(email: string): Observable<ResponseModel<ResendOtpResponse>> {
    const body = {email}
    return this.http.post<ResponseModel<ResendOtpResponse>>(`${this.apiKey}/resend-otp`, body);
  }

  login(data:object):Observable<ResponseModel<LoginResponse>>{

    return this.http.post<ResponseModel<LoginResponse>>(`${this.apiKey}/login`,data)
  }

  profile(candidateData: FormData): Observable<ResponseModel<ProfileResponse>> {
    console.log(candidateData);
    
    return this.http.post<ResponseModel<ProfileResponse>>(`${this.apiKey}/add-profile`, candidateData);
}

    getJobByJobID(job_id:string):Observable<ResponseModel<JobPosting>>{
      return this.http.get<ResponseModel<JobPosting>>(`${this.apiKey}/apply-job/${job_id}`)
    }


  forgotPassword(email:string):Observable<ResponseModel<ForgetResponse>>{
    const body = email
    return this.http.post<ResponseModel<ForgetResponse>>(`${this.apiKey}/forgot-password`,body)
  }

  verifyForgetPassword(otp:string,token:string):Observable<ResponseModel<VerifyForgetResponse>>{
    const body = {otp,token}
    return this.http.post<ResponseModel<VerifyForgetResponse>>(`${this.apiKey}/verify-forget-password`,body)
  }

  resetPassword(email:string,newPassword:string):Observable<ResponseModel<VerifyForgetResponse>>{
    const body = {email,newPassword};
    return this.http.post<ResponseModel<VerifyForgetResponse>>(`${this.apiKey}/reset-password`,body)
  }

  getJobsForCandidate(candidateId: string): Observable<ResponseModel<HomeJob[]>> {
    return this.http.get<ResponseModel<HomeJob[]>>(`${this.apiKey}/${candidateId}/home`);
  }

  applyJob(jobId:string,userId:string):Observable<ResponseModel<JobApplyResponse>>{
    const body = {jobId,userId}
    return this.http.post<ResponseModel<JobApplyResponse>>(`${this.apiKey}/apply-job`, body);
  }

  getJobApplications(userId: string): Observable<ResponseModel<RawJobData[]>> {
    return this.http.get<ResponseModel<RawJobData[]>>(`${this.apiKey}/applied-jobs/${userId}`);
  }

  getJobApplicationStatistics(id:string):Observable<ResponseModel<JobApplicationStatistics>>{
    return this.http.get<ResponseModel<JobApplicationStatistics>>(`${this.apiKey}/job-application-statistics/${id}`)
  }

  getCandidateDetails(id:string):Observable<ResponseModel<CandidateData>>{
    return this.http.get<ResponseModel<CandidateData>>(`${this.apiKey}/profile/${id}`)
  }

  updateCandidateEducation(userId: string, educationData: Education[]): Observable<ResponseModel<Education[]>> {
    return this.http.put<ResponseModel<Education[]>>(`${this.apiKey}/profile/education/${userId}`, educationData);
  }

  updateCandidateExperience(userId: string, experienceData: ExperienceData[]): Observable<ResponseModel<ExperienceData[]>> {
    return this.http.put<ResponseModel<ExperienceData[]>>(`${this.apiKey}/profile/experience/${userId}`, experienceData);
  }

  updateCandidateSkills(userId: string, skills: string[]): Observable<ResponseModel<string[]>> {
    return this.http.put<ResponseModel<string[]>>(`${this.apiKey}/profile/skills/${userId}`, skills);
  }

  updateCandidateProfile(id: string, profileData: BasicCandidateData): Observable<ResponseModel<CandidateData>> {
    return this.http.put<ResponseModel<CandidateData>>(`${this.apiKey}/profile/${id}`, profileData);
  }


  getMessagedUsers(userId: string): Observable<ResponseModel<Sender[]>> {
    return this.http.get<ResponseModel<Sender[]>>(`${this.apiKey}/users/${userId}/messaged-users`);
  }

  getUser(id: string): Observable<ResponseModel<UserDetails>> {
    return this.http.get<ResponseModel<UserDetails>>(`${this.apiKey}/recruiter-details/${id}`)
  }
  
  
  
}