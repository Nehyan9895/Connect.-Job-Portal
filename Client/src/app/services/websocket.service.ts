import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io'
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatI } from '../models/chat.model';
import { ToastrService } from 'ngx-toastr';
import { VideoCallModalComponent } from '../components/shared/video-call-modal/video-call-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  private notificationSubject = new BehaviorSubject<{ type: string, message: string } | null>(null); // Provide initial value
  private heartbeatInterval: NodeJS.Timeout|undefined;

  constructor(private socket: Socket,private toastr: ToastrService,private dialog: MatDialog) {
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('online-users', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });

    this.socket.on('notification', (notification: { type: string, message: string,link?:string }) => {
      console.log('Received notification:', notification);
      this.showNotification(notification.type, notification.message,notification?.link);
    });
    
  

  }

  connectUser(userId: string) {
    this.socket.emit('user-connect', userId);
    this.startHeartbeat(userId);
  }

  disconnectUser() {
    this.socket.disconnect();
    this.stopHeartbeat();
  }

  getOnlineUsers(): Observable<string[]> {
    return this.onlineUsersSubject.asObservable();
  }

  // In WebsocketService
getNotification(): Observable<{ type: string, message: string,link?:string } | null> {
  return this.socket.fromEvent<{ type: string, message: string,link?:string }>('notification');
}

startInterview({  job,candidateId, roomID }: { job:string, candidateId: string; roomID: string }) {
  this.socket.emit('startInterview', {  job,candidateId, roomID });
}




  isUserOnline(userId: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getOnlineUsers().subscribe(users => {
        observer.next(users.includes(userId));
      });
    });
  }

  private startHeartbeat(userId: string) {
    this.heartbeatInterval = setInterval(() => {
      this.socket.emit('heartbeat', userId);
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }







  joinDirectChat(userId: string, friendId: string) {
    this.socket.emit('joinChat', { senderId: userId, receiverId: friendId });
  }

  sendDirectMessage(senderId: string, receiverId: string, message: string,username:string) {
    this.socket.emit('sendMessage', { senderId, receiverId, message,username });
  }

  getLastMessage(): Observable<ChatI> {
    return this.socket.fromEvent<ChatI>('message');
  }

  getAllMessages(): Observable<ChatI[]> {
    return this.socket.fromEvent<ChatI[]>('allMessages');
  }

  private showNotification(type: string, message: string, link?: string) {
    if (type === 'video') {
      this.openVideoCallModal(message, link as string);
    } else {
      this.toastr.info(message, 'Notification');
    }
  }

  private openVideoCallModal(message: string, link: string) {
    this.dialog.open(VideoCallModalComponent, {
      width: '400px',
      data: { message, link }
    });
  }


}
