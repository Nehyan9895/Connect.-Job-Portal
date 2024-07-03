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
  
  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

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
      const isTrue =  token ? !this.jwtHelper.isTokenExpired(token) : false;
      console.log(isTrue);
      return isTrue
      
    }
    return false;  // default to not logged in if not in browser context
  }

  login(data:object):Observable<any>{
    return this.http.post(`${this.apiKey}/login`,data)
  }


  profile(recruiterData: FormData): Observable<any> {
    return this.http.post(`${this.apiKey}/profile`, recruiterData);
  }

  createJob(email:string,jobData:object):Observable<any>{
    const data = {email,jobData}
    return this.http.post(`${this.apiKey}/create-job`,data)
  }

  getJobs(userId:string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/home/${userId}`);
  }

  getJobByJobID(job_id:string):Observable<any>{
    return this.http.get<any>(`${this.apiKey}/edit-job/${job_id}`)
  }

  updateJob(jobData:object):Observable<any>{
    return this.http.post<any>(`${this.apiKey}/edit-job`,jobData)
  }

  getApplications(jobId:string):Observable<any>{
    return this.http.get<any>(`${this.apiKey}/applicants/${jobId}`)
  }

  logout():void{
    localStorage.removeItem('recruiterToken');
    this.router.navigate(['/recruiter/login'])
  }

  private jobsData: any[] = [];

  setJobs(jobs: any[]) {
    this.jobsData = jobs;
  }

  getJobsLocal() {
    return this.jobsData;
  }


}
