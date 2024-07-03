import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request URL: ' + req.url);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Error from interceptor', error);
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.message}`;
      } else {
        // Server-side error
        if (error.error && error.error.error && error.error.error.message) {
          errorMessage = `${error.error.error.message}`;
        } else {
          errorMessage = ` ${error.message}`;
        }
      }
      console.warn(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};