import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Job, JobPosting, RecruiterJob } from '../models/job.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ResponseModel, UserDetails } from '../models/userResponseModel';
import { JobApplicationDetails, LoginResponseData, RecruiterProfile, RecruiterProfileFull, UpdateApplicationReviewedResponse } from '../models/recruiterResponseModel';
import { Interview, InterviewDetails } from '../models/interviewModel';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  private token: string | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  private apiKey = environment.recruiterApiKey

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.token) {
        this.token = localStorage.getItem('recruiterToken');
      }
    }
    return this.token;
  }


  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const isTrue = token ? !this.jwtHelper.isTokenExpired(token) : false;
      console.log(isTrue);
      return isTrue

    }
    return false;  // default to not logged in if not in browser context
  }

  login(data: object){
    return this.http.post<ResponseModel<LoginResponseData>>(`${this.apiKey}/login`, data)
  }


  profile(recruiterData: FormData): Observable<ResponseModel<RecruiterProfile>> {
    return this.http.post<ResponseModel<RecruiterProfile>>(`${this.apiKey}/add-profile`, recruiterData);
  }

  getUser(id: string): Observable<ResponseModel<UserDetails>> {
    return this.http.get<ResponseModel<UserDetails>>(`${this.apiKey}/candidate-details/${id}`)
  }

  getProfile(id: string): Observable<ResponseModel<RecruiterProfileFull>> {
    return this.http.get<ResponseModel<RecruiterProfileFull>>(`${this.apiKey}/profile/${id}`);
  }


  createJob(email: string, jobData: object): Observable<ResponseModel<RecruiterProfile>> {
    const data = { email, jobData }
    return this.http.post<ResponseModel<RecruiterProfile>>(`${this.apiKey}/create-job`, data)
  }

  getJobs(userId: string): Observable<ResponseModel<RecruiterJob[]>> {
    return this.http.get<ResponseModel<RecruiterJob[]>>(`${this.apiKey}/home/${userId}`);
  }

  getJobByJobID(job_id: string): Observable<ResponseModel<JobPosting>> {
    return this.http.get<ResponseModel<JobPosting>>(`${this.apiKey}/edit-job/${job_id}`)
  }

  updateJob(jobData: object): Observable<ResponseModel<UpdateApplicationReviewedResponse>> {
    return this.http.post<ResponseModel<UpdateApplicationReviewedResponse>>(`${this.apiKey}/edit-job`, jobData)
  }

  getApplications(jobId: string): Observable<ResponseModel<JobApplicationDetails[]>> {
    return this.http.get<ResponseModel<JobApplicationDetails[]>>(`${this.apiKey}/applicants/${jobId}`)
  }

  updateApplicationReviewed(applicationId: string): Observable<UpdateApplicationReviewedResponse> {
    return this.http.put<UpdateApplicationReviewedResponse>(`${this.apiKey}/applicants/${applicationId}`, {});
  }

  updateResumeViewed(applicationId: string): Observable<UpdateApplicationReviewedResponse> {
    return this.http.put<UpdateApplicationReviewedResponse>(`${this.apiKey}/applicants/view-resume/${applicationId}`, {});
  }

  // recruiter.service.ts
updateApplicationStatus(applicationId: string, status: string): Observable<UpdateApplicationReviewedResponse> {
  return this.http.put<UpdateApplicationReviewedResponse>(`${this.apiKey}/applicants/status/${applicationId}`, { status });
}

scheduleInterview(interviewDetails:InterviewDetails):Observable<InterviewDetails>{
  return this.http.post<InterviewDetails>(`${this.apiKey}/interviews/schedule`,interviewDetails)
}

getInterviews(): Observable<ResponseModel<Interview[]>> {
  return this.http.get<ResponseModel<Interview[]>>(`${this.apiKey}/interviews`);
}

getCompanyLocations(userId: string): Observable<ResponseModel<string[]>> {
  return this.http.get<ResponseModel<string[]>>(`${this.apiKey}/company-locations/${userId}`);
}

updateCompanyLocations(userId: string, companyLocations: string[]){
  return this.http.put(`${this.apiKey}/profile/company-location/${userId}`, companyLocations);
}

updateRecruiterProfile(id: string, profileData: RecruiterProfileFull){
  return this.http.put(`${this.apiKey}/profile/${id}`, profileData);
}



  logout(): void {
    this.token = null;
    localStorage.removeItem('recruiterToken');
    this.router.navigate(['/recruiter/login'])
  }

  private jobsData: RecruiterJob[] = [];

  setJobs(jobs: RecruiterJob[]) {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }

  getJobsLocal() {
    const jobData = localStorage.getItem('jobs');
    return jobData ? JSON.parse(jobData) : [];
  }


}
