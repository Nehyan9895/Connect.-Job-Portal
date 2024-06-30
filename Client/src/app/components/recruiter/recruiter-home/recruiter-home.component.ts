import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Job } from '../../../models/job.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
    selector: 'app-recruiter-home',
    standalone: true,
    templateUrl: './recruiter-home.component.html',
    styleUrl: './recruiter-home.component.scss',
    imports: [FooterComponent, RecruiterHeaderComponent, RecruiterSidebarComponent,CommonModule,MatPaginator]
})
export class RecruiterHomeComponent implements OnInit {

block() {
throw new Error('Method not implemented.');
}
    jobs: any[] = [];
    displayedJobs: any[] = [];
    length = 0;
    pageSize = 2;
    pageIndex = 0;
    pageSizeOptions = [2, 3, 4];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private recruiterService: RecruiterService, private toastr: ToastrService,private router:Router) {}

    ngOnInit(): void {
      const recruiter_id:string = localStorage.getItem('recruiter_id') as string
      this.recruiterService.getJobs(recruiter_id).subscribe((data) => {
        this.jobs = data.data;
        console.log(data.data);
        
        this.length = this.jobs.length;
        this.updateDisplayedJobs();
      });
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

    logout(): void {
      this.recruiterService.logout();
      this.toastr.success('Logout Successfully', 'Success');
    }

    getJobById(job_id:string) {
        localStorage.setItem('job_id',job_id)
        this.router.navigate(['/recruiter/edit-job'])
    }
}
