import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [RouterLinkActive,RouterLink,AsyncPipe],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  @Input() name:string = ''
  @Input() userImage:string = ''
  @Input() isFriendOnline:Observable<boolean> | undefined 
}
