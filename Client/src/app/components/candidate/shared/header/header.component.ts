import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { userService } from '../../../../services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() userImage: File | undefined;
  constructor(private userBackend:userService,private toastr:ToastrService){}
  logout():void{
    this.userBackend.logout()
    this.toastr.success('Logout Successfully', 'Success')
  }
}
