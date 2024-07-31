import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminBackendService } from '../services/admin.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const backendService = inject(AdminBackendService)
  const router = inject(Router)
  if(!backendService.isLoggedIn){
    return router.createUrlTree(['/admin/login']);
  }else{
    return true;
  }
};
