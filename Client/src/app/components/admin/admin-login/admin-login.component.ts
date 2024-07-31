import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AdminBackendService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink,FormsModule,FooterComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  loginForm:FormGroup;

  constructor(
    private adminBackend:AdminBackendService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private router:Router
  ){
    this.loginForm = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
    })
  }

  adminLogin(){
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
       
      this.adminBackend.login(this.loginForm.value).subscribe({
        next:(response)=>{
          console.log(response);
          localStorage.setItem('adminToken',response.data.token)
          localStorage.setItem('admin',response.data.admin)
          this.toastr.success(response.data.message,'Success')
          this.router.navigate(['/admin/dashboard'])
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

