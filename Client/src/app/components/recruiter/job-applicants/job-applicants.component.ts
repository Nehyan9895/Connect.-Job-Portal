import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RecruiterService } from '../../../services/recruiter.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { ScheduleInterviewModalComponent } from '../schedule-interview-modal/schedule-interview-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { JobApplicationDetails } from '../../../models/recruiterResponseModel';
import { InterviewDetails } from '../../../models/interviewModel';

@Component({
    selector: 'app-job-applicants',
    standalone: true,
    templateUrl: './job-applicants.component.html',
    styleUrl: './job-applicants.component.scss',
    imports: [CommonModule, RecruiterSidebarComponent, FooterComponent, RecruiterHeaderComponent,MatPaginator,ToastrModule,RouterLink,]
})
export class JobApplicantsComponent implements OnInit {
  candidates: JobApplicationDetails[] = [];
  displayedCandidates: JobApplicationDetails[] = [];
  length = 0;
  pageSize = 2;
  pageIndex = 0;
  pageSizeOptions = [2, 3, 4];
  recruiterId:string | null | undefined;

  constructor(private recruiterService: RecruiterService, private toastr: ToastrService, private router: Router,private dialog:MatDialog) { }

  ngOnInit(): void {
    const jobId = localStorage.getItem('jobId');
    if (jobId) {
        this.recruiterService.getApplications(jobId).subscribe((response) => {
            this.candidates = response.data;
            console.log('Candidates:', this.candidates);

            // Update application_reviewed status for each candidate
            this.candidates.forEach(candidate => {
                if (!candidate.application_reviewed) {
                    this.recruiterService.updateApplicationReviewed(candidate._id).subscribe(
                        () => candidate.application_reviewed = true,
                        error => console.error('Failed to update application reviewed status:', error)
                    );
                }
            });

            this.updateDisplayedJobs();
        }, error => {
            console.error('Error fetching applications:', error);
        });
    }
    this.recruiterId = localStorage.getItem('recruiter_id');
}


viewResume(candidate: JobApplicationDetails): void {
    candidate.resume_viewed = true; // Update locally first
    this.recruiterService.updateResumeViewed(candidate._id).subscribe(
        (response) => {
            this.toastr.success('Resume viewed successfully.');
        },
        (error) => {
            console.error('Error viewing resume:', error);
            this.toastr.error('Failed to view resume.');
            candidate.resume_viewed = false; // Revert locally if there's an error
        }
    );
}

acceptApplication(candidate: JobApplicationDetails, result: string): void {
  console.log(candidate);

  // Update application status
  this.recruiterService.updateApplicationStatus(candidate._id, result).subscribe(
    (response) => {
      if (result === 'Accepted for Interview') {
        this.toastr.success('Application accepted for interview successfully.', 'Success');
        this.openScheduleInterviewModal(candidate);
      } else if (result === 'Rejected') {
        candidate.result = 'Rejected'; // Update result immediately for rejection
        this.toastr.success('Application rejected successfully.', 'Success');
      }
    },
    (error) => {
      console.error('Error accepting application for interview:', error);
      this.toastr.error('Failed to accept application for interview.');
    }
  );
}

openScheduleInterviewModal(candidate: JobApplicationDetails): void {
  const dialogRef = this.dialog.open(ScheduleInterviewModalComponent, {
    width: '400px',
    data: { candidate }
  });

  dialogRef.componentInstance.scheduleInterview.subscribe((interviewDetails: InterviewDetails) => {
    this.recruiterService.scheduleInterview(interviewDetails).subscribe(
      (response) => {
        this.toastr.success('Interview scheduled successfully.', 'Success');
        candidate.result = 'Accepted for Interview'; // Update result after successful scheduling
      },
      (error) => {
        console.error('Error scheduling interview:', error);
        this.toastr.error('Failed to schedule interview.');
      }
    );
  });
}

  


updateDisplayedJobs(): void {
  if (this.candidates && this.candidates.length > 0) {
      const start = this.pageIndex * this.pageSize;
      const end = Math.min(start + this.pageSize, this.candidates.length);
      this.displayedCandidates = this.candidates.slice(start, end);
      console.log('Displayed Candidates:', this.displayedCandidates);
  } else {
      this.displayedCandidates = [];
      console.log('No candidates to display');
  }
}


  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedJobs();
  }

  
}