import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
    imports: [FooterComponent, RecruiterHeaderComponent,CommonModule,FormsModule,]
})


export class MessagesComponent implements OnInit, OnDestroy {
    messages: any[] = [];
    chatRooms: any[] = [];
    chatRoomId: string | null | undefined;
    newMessage: string = '';
    subscriptions: Subscription[] = [];
    currentUserId: string = 'current_user_id'; // Replace with actual current user ID
    selectedChatRoomUser: string | null = null;
    recentChatUsers: { chatRoomId: string, username: string }[] = [];
  
    constructor(
      private websocketService: WebsocketService,
      private route: ActivatedRoute,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      this.chatRoomId = this.route.snapshot.paramMap.get('id');
      this.loadChatRooms();
      if (this.chatRoomId) {
        this.joinRoom(this.chatRoomId);
      }
    }
  
    loadChatRooms(): void {
      const recruiterId = this.currentUserId; // Replace with actual recruiter ID
      this.websocketService.getChatRoomsByRecruiter(recruiterId).subscribe((rooms: any[]) => {
        this.chatRooms = rooms;
        this.recentChatUsers = rooms.map(room => {
          const otherUser = room.members.find((m: any) => m._id !== this.currentUserId);
          return { chatRoomId: room._id, username: otherUser?.username || 'Unknown' };
        });
        if (this.chatRoomId) {
          this.updateSelectedChatRoomUser(this.chatRoomId);
        }
      });
    }
  
    joinRoom(chatRoomId: string): void {
      this.websocketService.joinRoom(chatRoomId);
      const messageSubscription = this.websocketService.onNewMessage().subscribe((message: any) => {
        this.messages.push(message);
      });
      this.subscriptions.push(messageSubscription);
    }
  
    sendMessage(): void {
      if (this.newMessage.trim() !== '') {
        const message = {
          chatRoom_id: this.chatRoomId,
          text: this.newMessage,
          sender_id: this.currentUserId, // Replace with the actual sender's ID
          receiver_id: 'receiver_user_id' // Replace with the actual receiver's ID
        };
        this.websocketService.sendMessage(message);
        this.newMessage = '';
      }
    }
  
    selectChatRoom(chatRoomId: string): void {
      this.router.navigate(['/recruiter/chat', chatRoomId]).then(() => {
        this.updateSelectedChatRoomUser(chatRoomId);
      });
    }
  
    updateSelectedChatRoomUser(chatRoomId: string): void {
      const selectedRoom = this.chatRooms.find(room => room._id === chatRoomId);
      if (selectedRoom) {
        const otherUser = selectedRoom.members.find((m: any) => m._id !== this.currentUserId);
        this.selectedChatRoomUser = otherUser?.username || 'Unknown';
      }
    }
  
    ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }
  
  
