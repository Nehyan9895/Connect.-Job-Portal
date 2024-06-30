import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io(environment.ws_url);
  }

  joinRoom(chatRoomId: string): void {
    this.socket.emit('joinRoom', chatRoomId);
  }

  sendMessage(message: any): void {
    this.socket.emit('sendMessage', message);
  }

  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message: any) => {
        observer.next(message);
      });
    });
  }

  getChatRoomsByRecruiter(recruiterId: string): Observable<any> {
    return this.http.get(`${environment.recruiterApiKey}/recruiter/chat-rooms/${recruiterId}`);
  }
}


