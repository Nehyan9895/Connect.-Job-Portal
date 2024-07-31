import { Component } from '@angular/core';
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
    selector: 'app-forget-password',
    standalone: true,
    templateUrl: './forget-password.component.html',
    styleUrl: './forget-password.component.scss',
    imports: [
        FooterComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ]
})
export class ForgetPasswordComponent {
    email: FormGroup;
    otpSent: boolean = false;

    constructor(private userService: userService, private toastr: ToastrService, fb: FormBuilder, private router: Router) {
        this.email = fb.group({
            email: [null, [Validators.required, Validators.email]],
            otp:[null,[Validators.required]]
        });
    }

    forgotPassword() {
        if (!this.otpSent) {
            localStorage.setItem('forgotEmail',this.email.get('email')?.value)
            // Send OTP
            this.userService.forgotPassword(this.email.value).subscribe({
                next: (response) => {
                    console.log(response,'asdf');
                    localStorage.setItem('otpToken',response.data.token)
                    this.toastr.success(response.data.message, 'Success');
                    this.otpSent = true;
                },
                error: (error) => {
                    this.toastr.error(error.error, 'Error');
                    console.error(error);
                }
            });
        } else {
            const token = localStorage.getItem('otpToken')
            console.log(token,'this is token');
            
            if(token){
            this.userService.verifyForgetPassword(this.email.get('otp')?.value,token).subscribe({
                next:(response=>{
                    console.log(response);
                    
                    this.toastr.success(response.data.message,'Success')
                    this.router.navigate(['candidate/reset-password'])
                    const email = localStorage.getItem('forgotEmail')
                    console.log(email,'emailslslslsl');

                }),
                error: (error) => {
                    this.toastr.error(error.error.error, 'Error');
                    console.error(error);
                }
            })
            }
        }
    }
}
