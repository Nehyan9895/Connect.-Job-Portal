import { Component } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FooterComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm:FormGroup;
  image:string |undefined

  constructor(
    private userService:userService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private router:Router
  ){
    this.loginForm = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
    })
  }

  

  userLogin() {
    localStorage.setItem('candidateEmail', this.loginForm.value.email);
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
       
      this.userService.login(this.loginForm.value).subscribe({
        next:(response)=>{
          console.log(response,'reseress');
          localStorage.setItem('userToken',response.data.token)
          const user = response.data.user
          this.image = user.image
          localStorage.setItem('user_id',user.id)
          this.toastr.success(response.data.message,'Success')

          if(user.is_done){
          this.router.navigate(['/candidate/home'])
          
          }else{
            this.router.navigate(['/candidate/add-profile'])
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
