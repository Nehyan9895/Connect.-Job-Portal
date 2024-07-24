import { Component, OnInit } from '@angular/core';
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [RecruiterSidebarComponent, RecruiterHeaderComponent, FooterComponent,DatePipe,CommonModule],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.scss'
})

export class InterviewsComponent implements OnInit {
  interviews: any[] = [];

  constructor(private recruiterService: RecruiterService,private router:Router) { }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.recruiterService.getInterviews().subscribe(data => {
      this.interviews = data.data.filter((interview: any) => !this.isPastInterview(interview));
      ;
      console.log(data.data);
      
    });
  }

  isInterviewTime(interview: any): boolean {
    const now = new Date();
    const interviewDate = new Date(interview.date);
  
    // Split the time string and set hours, minutes, and seconds for interviewDate
    const [hours, minutes] = interview.time.split(':').map(Number);
    interviewDate.setHours(hours, minutes, 0, 0);
  
    // Calculate the end time of the interview (assuming a 1-hour interview slot)
    const interviewEndTime = new Date(interviewDate.getTime() + 60 * 60 * 1000);
  
    const result =  now >= interviewDate && now <= interviewEndTime;
    return result
  }
  
  

  startInterview(interview: any): void {
    this.router.navigate(['/video-call']);

  }

  isPastInterview(interview: any): boolean {
    const now = new Date();
    const interviewDate = new Date(interview.date);

    // Split the time string and set hours, minutes, and seconds for interviewDate
    const [hours, minutes] = interview.time.split(':').map(Number);
    interviewDate.setHours(hours, minutes, 0, 0);

    // Calculate the end time of the interview (assuming a 1-hour interview slot)
    const interviewEndTime = new Date(interviewDate.getTime() + 60 * 60 * 1000);

    return now > interviewEndTime;
  }

}

