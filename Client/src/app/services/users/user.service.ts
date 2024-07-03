import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { Job } from '../../models/job.model';

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





  signup(data:object):Observable<any>{
    return this.http.post<any>(`${this.apiKey}/signup`,data)
  }

  verifyOtp(otp: string, token: string): Observable<any> {

    const body = { otp,token }; 
    return this.http.post<any>(`${this.apiKey}/verify-otp`, body);
  }

  resendOtp(email: string): Observable<any> {
    const body = {email}
    return this.http.post(`${this.apiKey}/resend-otp`, body);
  }

  login(data:object):Observable<any>{

    return this.http.post(`${this.apiKey}/login`,data)
  }

  profile(candidateData: FormData): Observable<any> {
    console.log(candidateData);
    
    return this.http.post(`${this.apiKey}/profile`, candidateData);
}

  getJobByJobID(job_id:string):Observable<any>{
    return this.http.get<any>(`${this.apiKey}/apply-job/${job_id}`)
  }


  forgotPassword(email:string):Observable<any>{
    const body = email
    return this.http.post(`${this.apiKey}/forgot-password`,body)
  }

  verifyForgetPassword(otp:string,token:string):Observable<any>{
    const body = {otp,token}
    return this.http.post(`${this.apiKey}/verify-forget-password`,body)
  }

  resetPassword(email:string,newPassword:string):Observable<any>{
    const body = {email,newPassword};
    return this.http.post(`${this.apiKey}/reset-password`,body)
  }

  getJobsForCandidate(candidateId: string): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/${candidateId}/home`);
  }

  applyJob(jobId:string,userId:string):Observable<any>{
    const body = {jobId,userId}
    return this.http.post<any>(`${this.apiKey}/apply-job`, body);
  }

  getJobApplications(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiKey}/applied-jobs/${userId}`);
  }
  
}