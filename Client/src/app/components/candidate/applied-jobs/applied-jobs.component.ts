import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { JobTypePipe } from "../../../pipes/job-type.pipe";
import { Job, JobForApplication, RawJobData } from '../../../models/job.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-applied-jobs',
    standalone: true,
    templateUrl: './applied-jobs.component.html',
    styleUrl: './applied-jobs.component.scss',
    imports: [HeaderComponent, FooterComponent, CommonModule, JobTypePipe]
})

export class AppliedJobsComponent implements OnInit {
  jobs: JobForApplication[] = [];
  selectedJob?: JobForApplication;

  applicationSteps = [
    { number: 1, name: 'Application Sent' },
    { number: 2, name: 'Application Reviewed' },
    { number: 3, name: 'Resume Viewed' },
    { number: 4, name: 'Result' }
  ];

  constructor(private userService: userService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.userService.getJobApplications(userId).subscribe({
        next: (data) => {
          this.jobs = data.data.map((application: RawJobData) => this.mapToJobForApplication(application));
          this.toastr.info('Job applications loaded successfully');
        },
        error: (error) => {
          console.error('Error fetching job applications:', error);
          this.toastr.error('Failed to load job applications', error.message);
        }
      });
    } else {
      this.toastr.error('User ID is missing', 'Error');
    }
  }

  showJobDetails(jobId: string): void {
    this.selectedJob = this.jobs.find((job) => job.id === jobId);
  }

  getCircleClass(step: { number: number; name: string }): string {
    if (!this.selectedJob) return 'bg-gray-300';

    const status = this.selectedJob.status;
    if (step.number === 4) {
      return status === 'Accepted for Interview' ? 'bg-green-500' : status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300';
    }

    const stepIndex = this.applicationSteps.findIndex((s) => s.number === step.number);
    const currentStepIndex = this.getApplicationStatusIndex(this.selectedJob.status);
    return stepIndex <= currentStepIndex ? 'bg-green-500' : 'bg-gray-300';
  }

  private mapToJobForApplication(application: RawJobData): JobForApplication {
    return {
      id: application.job_id._id,
      title: application.job_id.job_title,
      status: this.getApplicationStatus(application),
      statusClass: this.getApplicationStatusClass(application),
      logo: 'https://placehold.co/40x40', // Replace with actual logo URL if available
      company: application.job_id.company,
      location: application.job_id.job_location,
      salaryMin: application.job_id.salary_range_min,
      salaryMax: application.job_id.salary_range_max,
      jobType: application.job_id.job_type,
      jobMode: application.job_id.job_mode,
      experience: application.job_id.experience_required,
      skills: application.job_id.skills_required,
      description: application.job_id.description,
      responsibilities: application.job_id.responsibilities,
      preference: application.job_id.preference,
    };
  }

  private getApplicationStatus(application: RawJobData): string {
    if (application.result === 'Accepted for Interview' || application.result === 'Rejected') return application.result;
    if (application.resume_viewed) return 'Resume Viewed';
    if (application.application_reviewed) return 'Application Reviewed';
    if (application.application_sent) return 'Application Sent';
    return 'Applied';
  }

  private getApplicationStatusClass(application: RawJobData): string {
    if (application.result === 'Rejected') return 'text-red-500';
    if (application.result === 'Accepted for Interview') return 'text-green-500';
    if (application.resume_viewed) return 'text-yellow-500';
    if (application.application_reviewed) return 'text-blue-500';
    if (application.application_sent) return 'text-green-500';
    return 'text-gray-500';
  }

  private getApplicationStatusIndex(status: string): number {
    if (status === 'Accepted for Interview' || status === 'Rejected') return 4;
    return this.applicationSteps.findIndex((s) => s.name === status);
  }
}



