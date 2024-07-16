import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminBackendService {

  private apiKey = environment.adminApiKey;

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  login(data:object):Observable<any>{
    return this.http.post(`${this.apiKey}/login`,data)
  }

  getUsers():Observable<any>{
    return this.http.get<any>(`${this.apiKey}/user-list`);

  }

  updateUserVerificationStatus(userId: string, is_verified: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiKey}/users/${userId}/verification`, { is_verified });
  }

  updateRecruiterVerificationStatus(userId: string, is_verified: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiKey}/recruiters/${userId}/verification`, { is_verified });
  }

  getRecruiters():Observable<any>{
    return this.http.get<any>(`${this.apiKey}/recruiter-list`)
  }



  get isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      const adminToken = localStorage.getItem('adminToken');
      return !!adminToken;
    }
    return false;
  }

  logout():void{
    localStorage.removeItem('adminToken');
    this.router.navigate(['/admin'])
  }
}
