import { HttpInterceptorFn } from '@angular/common/http';

export const recruiterAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('recruiterToken');
  if(token){
  console.log('chumma');
  }
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};

