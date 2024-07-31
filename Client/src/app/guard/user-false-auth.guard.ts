import { CanActivateFn, Router } from '@angular/router';
import { userService } from '../services/user.service';
import { inject } from '@angular/core';


export const userFalseAuth: CanActivateFn = (route, state) => {
  const backendService = inject(userService);
  const router = inject(Router)
  if(backendService.isLoggedIn()){
    router.navigate(['/candidate/home']); 
    return false;
  }else{
     return true
  }
};