import { CanActivateFn, Router } from '@angular/router';
import { RecruiterService } from '../services/recruiter.service';
import { inject } from '@angular/core';

export const recruiterAuthGuard: CanActivateFn = (route, state) => {
  const backendService = inject(RecruiterService);
  const router = inject(Router)
  if (backendService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/recruiter/login'])
    return false;
  }
};
