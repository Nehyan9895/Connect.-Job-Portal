import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { userService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../../services/websocket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() userImage: File | undefined;
  constructor(private userBackend:userService,private toastr:ToastrService,private webSocketService:WebsocketService){}
  logout():void{
    this.userBackend.logout()
    this.webSocketService.disconnectUser();
    this.toastr.success('Logout Successfully', 'Success')
  }
}
