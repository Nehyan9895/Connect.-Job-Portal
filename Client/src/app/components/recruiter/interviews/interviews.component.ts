import { Component, OnInit, ViewChild } from '@angular/core';
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterService } from '../../../services/recruiter.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Interview } from '../../../models/interviewModel';
import { WebsocketService } from '../../../services/websocket.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [RecruiterSidebarComponent, RecruiterHeaderComponent, FooterComponent, DatePipe, CommonModule, MatPaginator],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss'
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  displayedInterviews: Interview[] = [];
  length = 0;
  pageSize = 2;
  pageIndex = 0;
  pageSizeOptions = [2, 3, 4];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private recruiterService: RecruiterService, private router: Router, private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.recruiterService.getInterviews().subscribe(data => {
      this.interviews = data.data.filter((interview: Interview) => !this.isPastInterview(interview));
      this.length = this.interviews.length;
      this.updateDisplayedInterviews();
    });
  }

  updateDisplayedInterviews(): void {
    const start = this.pageIndex * this.pageSize;
    const end = Math.min(start + this.pageSize, this.length);
    this.displayedInterviews = this.interviews.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedInterviews();
  }

  isInterviewTime(interview: Interview): boolean {
    const now = new Date();
    const interviewDate = new Date(interview.date);
    const [hours, minutes] = interview.time.split(':').map(Number);
    interviewDate.setHours(hours, minutes, 0, 0);
    const interviewEndTime = new Date(interviewDate.getTime() + 60 * 60 * 1000);
    return now >= interviewDate && now <= interviewEndTime;
  }

  startInterview(interview: Interview): void {
    this.webSocketService.startInterview({
      job: interview.jobId.job_title,
      candidateId: interview.candidateId.user_id,
      roomID: interview.roomId
    });
    this.router.navigate(['/video-call'], {
      queryParams: { roomID: interview.roomId }
    });
  }

  isPastInterview(interview: Interview): boolean {
    const now = new Date();
    const interviewDate = new Date(interview.date);
    const [hours, minutes] = interview.time.split(':').map(Number);
    interviewDate.setHours(hours, minutes, 0, 0);
    const interviewEndTime = new Date(interviewDate.getTime() + 60 * 60 * 1000);
    return now > interviewEndTime;
  }
}
