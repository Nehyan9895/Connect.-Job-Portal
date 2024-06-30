import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { userService } from '../../../services/users/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-applied-jobs',
    standalone: true,
    templateUrl: './applied-jobs.component.html',
    styleUrl: './applied-jobs.component.scss',
    imports: [HeaderComponent, FooterComponent,CommonModule]
})

export class AppliedJobsComponent implements OnInit {
  jobs: any[] = [];
  selectedJob?: any;

  applicationSteps = [
    { number: 1, name: 'Application Sent' },
    { number: 2, name: 'Application Reviewed' },
    { number: 3, name: 'Interview' },
    { number: 4, name: 'Result' }
  ];

  constructor(private userService: userService, private toastr: ToastrService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    this.userService.getJobApplications(userId).subscribe(
      (data) => {
        this.jobs = data.map((application: any) => ({
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
        }));
        this.toastr.info('Job applications loaded successfully');
      },
      (error) => {
        console.error('Error fetching job applications:', error);
        this.toastr.error('Failed to load job applications', error.message);
      }
    );
  }

  showJobDetails(jobId: string): void {
    this.selectedJob = this.jobs.find((job: { id: string }) => job.id === jobId);
  }

  getStepClass(step: { number: number; name: string }): string {
    if (!this.selectedJob) return 'bg-gray-300';
    const stepIndex = this.applicationSteps.findIndex((s) => s.number === step.number);
    const currentStepIndex = this.getApplicationStatusIndex(this.selectedJob.status);
    return stepIndex <= currentStepIndex ? 'bg-green-500' : 'bg-gray-300';
  }

  private getApplicationStatus(application: any): string {
    if (application.rejected || application.selected) return 'Result';
    if (application.interview) return 'Interview';
    if (application.application_reviewed) return 'Application Reviewed';
    if (application.application_sent) return 'Application Sent';
    return 'Applied';
  }

  private getApplicationStatusClass(application: any): string {
    if (application.rejected) return 'text-red-500';
    if (application.selected) return 'text-green-500';
    if (application.interview) return 'text-yellow-500';
    if (application.application_reviewed) return 'text-blue-500';
    if (application.application_sent) return 'text-green-500';
    return 'text-gray-500';
  }

  private getApplicationStatusIndex(status: string): number {
    return this.applicationSteps.findIndex((s) => s.name === status);
  }
}

