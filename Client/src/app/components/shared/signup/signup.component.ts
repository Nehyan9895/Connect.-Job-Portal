import { Component } from '@angular/core';
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userService } from '../../../services/user.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { MatSlideToggleModule,_MatSlideToggleRequiredValidatorModule,} from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FooterComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  userForm:FormGroup;
  isChecked = true;

  constructor(private userService:userService,private toster: ToastrService, fb: FormBuilder, private router: Router){ 
    this.userForm = fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
      confirmPassword: [null, Validators.required],
      isEmployee:[null,Validators.required]
    })
    
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  signupUser(){
    console.log('clicked',typeof this.userForm.value);
    localStorage.setItem('email',this.userForm.value.email)
    
    this.userService.signup(this.userForm.value).subscribe({
      next: (response)=>{
        console.log(response);
        
        this.toster.success(response.data.message,'success')
        
        localStorage.setItem('isEmployee',this.userForm.value.isEmployee)
        this.userForm.reset();
        this.router.navigate(['/candidate/otp-page']) 
        localStorage.setItem('otpToken',response.data.otpToken)
      },
      error:(error) =>{
        this.toster.error(error.error.error,'Error');
        console.error(error);
      }
    })
  }
  
}
