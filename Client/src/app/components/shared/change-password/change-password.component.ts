import { Component } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    standalone: true,
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss',
    imports: [FooterComponent,CommonModule,ReactiveFormsModule,FormsModule]
})
export class ChangePasswordComponent {

userForm: FormGroup;
    constructor(private fb:FormBuilder,private userService:userService,private toastr:ToastrService,private router:Router){
        this.userForm = fb.group({
            password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
            confirmPassword: [null, Validators.required],
        })
    }

    submitForm() {
        const email = localStorage.getItem('forgotEmail')

        if(email){
            this.userService.resetPassword(email,this.userForm.get('password')?.value).subscribe({
                next:(response=>{
                    console.log(response);
                    this.toastr.success(response.data.message,'Success')
                    this.router.navigate(['candidate/login'])
                }),
                error: (error) => {
                    this.toastr.error(error.error.error, 'Error');
                    console.error(error);
                }
            })
        }
    }


}
