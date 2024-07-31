import { Component } from '@angular/core';
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecruiterService } from '../../../services/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recruiter-login',
    standalone: true,
    templateUrl: './recruiter-login.component.html',
    styleUrl: './recruiter-login.component.scss',
    imports: [FooterComponent,RouterLink,CommonModule,ReactiveFormsModule]
})
export class RecruiterLoginComponent {
    loginForm:FormGroup;
  

  constructor(
    private recruiterService:RecruiterService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private router:Router
  ){
    this.loginForm = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
    })
  }

  

  recruiterLogin() {
    localStorage.setItem('recruiterEmail', this.loginForm.value.email);
    
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
       
      this.recruiterService.login(this.loginForm.value).subscribe({
        next:(response)=>{
          console.log(response,'reseress');
          localStorage.setItem('recruiterToken',response.data.token)
          localStorage.setItem('recruiter_id',response.data.recruiter.id)
          const recruiter = response.data.recruiter
          this.toastr.success(response.data.message,'Success')
          if(recruiter.is_done){
          this.router.navigate(['/recruiter/home'])
          }else{
            this.router.navigate(['/recruiter/add-profile'])
          }
        },
        error: (error) => {
          this.toastr.error(error.error.error, 'Error');
          console.error(error);
        }
      })
    } else {
      this.toastr.error('Please enter valid email and password', 'Error');
    }
  }
}
