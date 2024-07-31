import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ResponseModel } from '../models/userResponseModel';
import { AdminLoginResponse } from '../models/adminResponseModel';
import { ICandidate } from '../models/candidate.model';
import { IRecruiter } from '../models/recruiter.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBackendService {

  private apiKey = environment.adminApiKey;

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  login(data:object):Observable<ResponseModel<AdminLoginResponse>>{
    return this.http.post<ResponseModel<AdminLoginResponse>>(`${this.apiKey}/login`,data)
  }

  getUsers():Observable<ResponseModel<ICandidate[]>>{
    return this.http.get<ResponseModel<ICandidate[]>>(`${this.apiKey}/user-list`);

  }

  updateUserVerificationStatus(userId: string, is_verified: boolean): Observable<ResponseModel<ICandidate>> {
    return this.http.patch<ResponseModel<ICandidate>>(`${this.apiKey}/users/${userId}/verification`, { is_verified });
  }

  updateRecruiterVerificationStatus(userId: string, is_verified: boolean): Observable<ResponseModel<IRecruiter>> {
    return this.http.patch<ResponseModel<IRecruiter>>(`${this.apiKey}/recruiters/${userId}/verification`, { is_verified });
  }

  getRecruiters():Observable<ResponseModel<IRecruiter[]>>{
    return this.http.get<ResponseModel<IRecruiter[]>>(`${this.apiKey}/recruiter-list`)
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
