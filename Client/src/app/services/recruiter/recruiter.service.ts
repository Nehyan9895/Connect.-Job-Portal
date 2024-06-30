import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Job } from '../../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  private apiKey = environment.recruiterApiKey

  get isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      const recruiterToken = localStorage.getItem('recruiterToken');
      return !!recruiterToken;
    }
    return false;
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

  updateJob(jobData:object):Observable<Job[]>{
    return this.http.post<Job[]>(`${this.apiKey}/edit-job`,jobData)
  }

  logout():void{
    localStorage.removeItem('recruiterToken');
    this.router.navigate(['/recruiter/login'])
  }
}
