import { Component } from '@angular/core';
import { AdminHeaderComponent } from "../shared/admin-header/admin-header.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { AdminSideBarComponent } from "../shared/admin-side-bar/admin-side-bar.component";
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { JobTypePipe } from "../../../pipes/job-type.pipe";
import { JobForApplication } from '../../../models/job.model';
import { Application } from '../../../models/applicationModel';

@Component({
    selector: 'app-user-application-list',
    standalone: true,
    templateUrl: './user-application-list.component.html',
    styleUrl: './user-application-list.component.scss',
    imports: [AdminHeaderComponent, FooterComponent, AdminSideBarComponent, CommonModule, JobTypePipe]
})
export class UserApplicationListComponent {
    jobs: JobForApplication[] = [];
  selectedJob?: JobForApplication;

  applicationSteps = [
    { number: 1, name: 'Application Sent' },
    { number: 2, name: 'Application Reviewed' },
    { number: 3, name: 'Resume Viewed' },
    { number: 4, name: 'Result' }
  ];

  constructor(private userService: userService, private toastr: ToastrService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id') as string;
    this.userService.getJobApplications(userId).subscribe(
      (data) => {
        this.jobs = data.data.map((application: any) => ({
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

  getCircleClass(step: { number: number; name: string }): string {
    if (!this.selectedJob) return 'bg-gray-300';

    const status = this.selectedJob.status;
    if (step.number === 4) {
      return status === 'Accepted' ? 'bg-green-500' : status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300';
    }

    const stepIndex = this.applicationSteps.findIndex((s) => s.number === step.number);
    const currentStepIndex = this.getApplicationStatusIndex(this.selectedJob.status);
    return stepIndex <= currentStepIndex ? 'bg-green-500' : 'bg-gray-300';
  }

  private getApplicationStatus(application: Application): string {
    if (application.result === 'Accepted' || application.result === 'Rejected') return application.result;
    if (application.resume_viewed) return 'Resume Viewed';
    if (application.application_reviewed) return 'Application Reviewed';
    if (application.application_sent) return 'Application Sent';
    return 'Applied';
  }

  private getApplicationStatusClass(application: Application): string {
    if (application.result === 'Rejected') return 'text-red-500';
    if (application.result === 'Accepted') return 'text-green-500';
    if (application.resume_viewed) return 'text-yellow-500';
    if (application.application_reviewed) return 'text-blue-500';
    if (application.application_sent) return 'text-green-500';
    return 'text-gray-500';
  }

  private getApplicationStatusIndex(status: string): number {
    if (status === 'Accepted' || status === 'Rejected') return 4;
    return this.applicationSteps.findIndex((s) => s.name === status);
  }
}
