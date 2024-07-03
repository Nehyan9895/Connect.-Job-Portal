import { Component, OnInit, ViewChild } from '@angular/core';
import { userService } from '../../../services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { Job } from '../../../models/job.model';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { JobTypePipe } from '../../../pipes/job-type.pipe';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [HeaderComponent, FooterComponent,CommonModule,MatPaginator,TagModule,JobTypePipe]
})
export class HomeComponent implements OnInit {
  jobs: any[] = [];
  displayedJobs: any[] = [];
  length = 0;
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions = [2, 3, 4];

  constructor(private userService: userService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    const candidateId = localStorage.getItem('user_id'); 
    if (candidateId) {
      this.userService.getJobsForCandidate(candidateId).subscribe((data) => {
        console.log(data);
        this.jobs = data.data;
        this.length = this.jobs.length;
        this.updateDisplayedJobs();
      });
    } else {
      this.toastr.error('User ID not found in local storage', 'Error');
    }
  }

  updateDisplayedJobs(): void {
    const start = this.pageIndex * this.pageSize;
    const end = Math.min(start + this.pageSize, this.length);
    this.displayedJobs = this.jobs.slice(start, end);
  }

  handlePageEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedJobs();
  }

  applyJob(jobId: string): void {
    console.log(jobId);
    localStorage.setItem('job_id', jobId);
    this.router.navigate(['/candidate/apply-job']);
  }

  logout(): void {
    // Implement logout logic here
    this.toastr.success('Logout Successfully', 'Success');
  }
}

