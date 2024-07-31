import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from "../shared/footer/footer.component";
import { HeaderComponent } from "../shared/header/header.component";
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, filter } from 'rxjs';
import { ChatI } from '../../../models/chat.model';
import { RecruiterService } from '../../../services/recruiter.service';
import { WebsocketService } from '../../../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { userService } from '../../../services/user.service';
import { privateDecrypt } from 'crypto';
import { Sender } from '../../../models/candidate.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  providers: [DatePipe],
  imports: [FooterComponent, HeaderComponent,CommonModule, FormsModule,RouterLink,],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userImage!: string;
  username!: string;  

  senders: Sender[] = [];
                                   
  recruiterId: string | null = null;
  candidateId: string | null = null;
  message!: string;
  messages: ChatI[] = [];
  isFriendOnline$: Observable<boolean> | undefined;

  private paramSubscription!: Subscription;
  private messagesSubscription!: Subscription;
  private lastMessageSubscription!: Subscription;
  private routerSubscription!: Subscription;
  notificationSubscription!: Subscription;


  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private chatService: WebsocketService,
    private toaster: ToastrService,
    private recruiterService: RecruiterService,
    private userService:userService
  ) { }

  ngOnInit(): void {
    this.candidateId = localStorage.getItem('user_id')
    if(this.candidateId){
   this.userService.getMessagedUsers(this.candidateId).subscribe((data)=>{
    this.senders = data.data
    console.log(this.senders);
    
   })
    }

    

  }

  showMessages(id:string){
    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.recruiterId = id
      this.initializeChat();
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializeChat();
    });

    

    // Fetch user data
    if(this.recruiterId){
    this.userService.getUser(this.recruiterId).subscribe(user => {
      console.log(user,'thisis user from ther');
      
      this.userImage = user.data.image;
      this.username = user.data.fullName;
    });
  }
  }

  initializeChat(): void {
    this.messages = [];
  
    if (this.recruiterId && this.candidateId) {
      this.chatService.joinDirectChat(this.candidateId, this.recruiterId);
      this.isFriendOnline$ = this.chatService.isUserOnline(this.recruiterId);
    } else {
      this.toaster.error('Error', 'Something Went Wrong. Please Try Again');
    }

    this.messagesSubscription = this.chatService.getAllMessages().subscribe(msg => {
      console.log(msg);
      
      this.messages = msg;
      this.scrollToBottom();
    });

    this.lastMessageSubscription = this.chatService.getLastMessage().subscribe((msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
    this.lastMessageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  formatTime(dateString: Date): string {
    return this.datePipe.transform(dateString, 'shortTime')!;
  }

  sendMessage() {
    if (this.recruiterId && this.candidateId && this.message.trim()) {
      this.chatService.sendDirectMessage(this.candidateId, this.recruiterId, this.message,this.username);
      this.message = '';
    } else {
      this.toaster.error('Something went wrong. Try logging in again.');
    }
  }

  

  isCurrentUser(senderId: string): boolean {
    return senderId === this.candidateId;
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}


