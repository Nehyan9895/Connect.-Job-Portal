import { Component } from '@angular/core';
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgxOtpInputConfig, NgxOtpInputModule } from 'ngx-otp-input';
import { FormsModule } from '@angular/forms';
import { userService } from '../../../services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-otp-page',
    standalone: true,
    templateUrl: './otp-page.component.html',
    styleUrls: ['./otp-page.component.scss'],
    imports: [
      FooterComponent,
      CommonModule,
      NgxOtpInputModule,
      FormsModule,
      ToastrModule  
    ]
})
export class OtpPageComponent {
  otp: string | undefined;
  resendDisabled: boolean = true;
  timeLeft: number = 60;
  interval: NodeJS.Timeout|undefined;

  constructor(
    private userService: userService,
    private toaster: ToastrService,
    private router: Router
  ) {
    this.startTimer();
  }

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  handleOtpChange(value: string[]): void {
    console.log(value);
  }

  handleFillEvent(value: string): void {
    this.otp = value;
  }

  verifyOtp() {
    console.log('clicked');
    const otpToken = localStorage.getItem('otpToken');
    const isEmployee = localStorage.getItem('isEmployee')
    console.log(isEmployee);
    
    console.log(otpToken);

    if (this.otp && otpToken) {
      this.userService.verifyOtp(this.otp, otpToken).subscribe({
        next: (response) => {
          console.log(response);
          this.toaster.success(response.data.message, 'Success');
          if(isEmployee){
            this.router.navigate(['/candidate/login'])
          }else{
          this.router.navigate(['/recruiter/login']);
          }
        },
        error: (error) => {
          this.toaster.error(error.error.message, 'Error');
          console.error(error);
        }
      });
    } else {
      this.toaster.error('OTP or token is missing', 'Error');
    }
  }

  resendOtp() {
    const email = localStorage.getItem('email');
    console.log(email,'dshfoiuhdfhdiufhfdiuhffhdshfdsfhdsfhdsfdshdsh');
    
    if (email) {
      this.userService.resendOtp(email).subscribe({
        next: (response) => {
          console.log(response);
          this.toaster.success(response.data.message, 'Success');
          localStorage.setItem('otpToken', response.data.newOtpToken);
          this.startTimer();
        },
        error: (error) => {
          this.toaster.error(error.error.message, 'Error');
          console.error(error);
        }
      });
    } else {
      this.toaster.error('Email verification token is missing', 'Error');
    }
  }

  startTimer() {
    this.resendDisabled = true;
    this.timeLeft = 60;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.resendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }
}
