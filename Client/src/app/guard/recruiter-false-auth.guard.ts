import { CanActivateFn, Router } from '@angular/router';
import { RecruiterService } from '../services/recruiter.service';
import { inject } from '@angular/core';

export const recruiterFalseAuthGuard: CanActivateFn = (route, state) => {
  const backendService = inject(RecruiterService);
  const router = inject(Router)
  if(backendService.isLoggedIn()){
    router.navigate(['/recruiter/home']); 
    return false;
  }else{
     return true
  }
};
