import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { Job, JobPosting } from '../../../models/job.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '../../../services/recruiter.service';
import { CommonModule } from '@angular/common';
import { userService } from '../../../services/user.service';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-apply-job',
    standalone: true,
    templateUrl: './apply-job.component.html',
    styleUrl: './apply-job.component.scss',
    imports: [HeaderComponent, FooterComponent,CommonModule]
})

export class ApplyJobComponent implements OnInit {
    job!: JobPosting; // Adjust the type as per your Job interface
    userId: string = localStorage.getItem('user_id') as string
  
    constructor(
      private route: ActivatedRoute,
      private userService: userService,
      private router: Router,
      private toastr: ToastrService
    ) { }
  
    ngOnInit(): void {
      const jobId = localStorage.getItem('job_id');
  
      if (jobId) {
        this.userService.getJobByJobID(jobId).subscribe(
          (job) => {
            this.job = job.data;
            console.log(this.job);
          
          },
          error => {
            console.error('Failed to fetch job details', error);
          }
        );
      }
    }
  
    applyJob(job_id: string): void {
      this.userService.applyJob(job_id, this.userId).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success(response.data.message, 'Success');
          this.router.navigate(['/candidate/home']);
        },
        error: (error) => {
          this.toastr.error(error.error.error, 'Error');
          console.error(error);
        }
      });
    }
  }
  