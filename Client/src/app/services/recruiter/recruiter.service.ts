import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Job } from '../../models/job.model';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    return this.http.post<any>(`${this.apiKey}/login`, data)
  }


  profile(recruiterData: FormData): Observable<any> {
    return this.http.post(`${this.apiKey}/add-profile`, recruiterData);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/candidate-details/${id}`)
  }

  getProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/profile/${id}`);
  }


  createJob(email: string, jobData: object): Observable<any> {
    const data = { email, jobData }
    return this.http.post(`${this.apiKey}/create-job`, data)
  }

  getJobs(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/home/${userId}`);
  }

  getJobByJobID(job_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/edit-job/${job_id}`)
  }

  updateJob(jobData: object): Observable<any> {
    return this.http.post<any>(`${this.apiKey}/edit-job`, jobData)
  }

  getApplications(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/applicants/${jobId}`)
  }

  updateApplicationReviewed(applicationId: string): Observable<any> {
    return this.http.put<any>(`${this.apiKey}/applicants/${applicationId}`, {});
  }

  updateResumeViewed(applicationId: string): Observable<any> {
    return this.http.put<any>(`${this.apiKey}/applicants/view-resume/${applicationId}`, {});
  }

  // recruiter.service.ts
updateApplicationStatus(applicationId: string, status: string): Observable<any> {
  return this.http.put<any>(`${this.apiKey}/applicants/status/${applicationId}`, { status });
}

scheduleInterview(interviewDetails:any):Observable<any>{
  return this.http.post<any>(`${this.apiKey}/interviews/schedule`,interviewDetails)
}

getInterviews(): Observable<any> {
  return this.http.get<any>(`${this.apiKey}/interviews`);
}

getCompanyLocations(userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiKey}/company-locations/${userId}`);
}

updateCompanyLocations(userId: string, companyLocations: string[]): Observable<any> {
  return this.http.put<any>(`${this.apiKey}/profile/company-location/${userId}`, companyLocations);
}

updateRecruiterProfile(id: string, profileData: any): Observable<any> {
  return this.http.put(`${this.apiKey}/profile/${id}`, profileData);
}



  logout(): void {
    this.token = null;
    localStorage.removeItem('recruiterToken');
    this.router.navigate(['/recruiter/login'])
  }

  private jobsData: any[] = [];

  setJobs(jobs: any[]) {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }

  getJobsLocal() {
    const jobData = localStorage.getItem('jobs');
    return jobData ? JSON.parse(jobData) : [];
  }


}
