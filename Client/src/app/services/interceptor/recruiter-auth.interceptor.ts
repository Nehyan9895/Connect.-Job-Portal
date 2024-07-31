import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// export const recruiterAuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('recruiterToken');
//   const router = inject(Router)
//   if (token) {
//     const cloned = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });

//     return next(cloned).pipe(
//       catchError((error:HttpErrorResponse)=>{
//         if (error.status === 401) {
//           localStorage.removeItem('recruiterToken')
//           router.navigate((['/candidate/login']))
//         }
//         return throwError(()=>error)
//       })
//     )
//   } else {
//     return next(req);
//   }
// };

