import { Component } from '@angular/core';
import { RecruiterService } from '../../../../services/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WebsocketService } from '../../../../services/websocket.service';

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
  constructor(private recruiterService:RecruiterService,private toastr:ToastrService,private webSocketService:WebsocketService){}
  logout(): void {
    this.recruiterService.logout()
    this.webSocketService.disconnectUser();
    this.toastr.success('Logout Successfully', 'Success')
  }
}
