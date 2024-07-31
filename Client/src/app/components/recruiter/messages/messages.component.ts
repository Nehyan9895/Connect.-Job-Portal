import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { WebsocketService } from '../../../services/websocket.service';
import { filter, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatI } from '../../../models/chat.model';
import { ToastrService } from 'ngx-toastr';
import { userService } from '../../../services/user.service';
import { ChatHeaderComponent } from "../shared/chat-header/chat-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter.service';

@Component({
    selector: 'app-messages',
    standalone: true,
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
    providers: [DatePipe],
    imports: [FooterComponent, RecruiterHeaderComponent, CommonModule, FormsModule, ChatHeaderComponent, RecruiterSidebarComponent,RouterLink,]
})


export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  userImage!: string;
  username!: string;  
                                   
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
    private recruiterService: RecruiterService
  ) { }

  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe((params) => {
      this.recruiterId = params.get('recruiterId');
      this.candidateId = params.get('candidateId');
      this.initializeChat();
    });

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.initializeChat();
    });

    

    // Fetch user data
    if(this.candidateId){
    this.recruiterService.getUser(this.candidateId).subscribe(user => {
      console.log(user,'thisis user from ther');
      
      this.userImage = user.data.image;
      this.username = user.data.fullName;
    });
  }

  

  }

  initializeChat(): void {
    this.messages = [];
  
    if (this.recruiterId && this.candidateId) {
      this.chatService.joinDirectChat(this.recruiterId, this.candidateId);
      this.isFriendOnline$ = this.chatService.isUserOnline(this.candidateId);
    } else {
      this.toaster.error('Error', 'Something Went Wrong. Please Try Again');
    }

    this.messagesSubscription = this.chatService.getAllMessages().subscribe(msg => {
      console.log(msg,'msghgosidhfdshf');
      
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
      this.chatService.sendDirectMessage(this.recruiterId, this.candidateId, this.message,this.username);
      this.message = '';
    } else {
      this.toaster.error('Something went wrong. Try logging in again.');
    }
  }

  isCurrentUser(senderId: string): boolean {
    return senderId === this.recruiterId;
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  

}
