import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { candidateRoute } from './routes/candidate.route';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { recruiterRoute } from './routes/recruiter.route';
import { sharedRoute } from './routes/shared.route';
import { adminRoute } from './routes/admin.route';
import { userAuthInterceptor } from './services/interceptor/user-auth.interceptor';
// import { recruiterAuthInterceptor } from './services/interceptor/recruiter-auth.interceptor';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';


const config: SocketIoConfig = { url: 'http://localhost:5001', options: {} };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideRouter(candidateRoute),
    provideRouter(recruiterRoute),
    provideRouter(sharedRoute),
    provideRouter(adminRoute),
    provideHttpClient(withInterceptors([userAuthInterceptor])),
    // provideHttpClient(withInterceptors([recruiterAuthInterceptor])),
    provideClientHydration(),
    provideHttpClient(withFetch()), 
    provideToastr({
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      easing: 'ease-in',
      toastClass: 'ngx-toastr',
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true, 
      timeOut: 3000, 
      progressAnimation: 'decreasing' 

    }), provideAnimationsAsync(), provideAnimationsAsync(),
    importProvidersFrom(SocketIoModule.forRoot(config)),  
    
  ]
};