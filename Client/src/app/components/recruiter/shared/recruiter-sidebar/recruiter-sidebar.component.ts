import { Component } from '@angular/core';
import { RecruiterService } from '../../../../services/recruiter/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-recruiter-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './recruiter-sidebar.component.html',
  styleUrl: './recruiter-sidebar.component.scss'
})
export class RecruiterSidebarComponent {
  constructor(private recruiterService:RecruiterService,private toastr:ToastrService){}
  logout(): void {
    this.recruiterService.logout()
    this.toastr.success('Logout Successfully', 'Success')
  }
}
