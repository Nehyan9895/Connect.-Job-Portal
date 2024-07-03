import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { MatPaginator } from '@angular/material/paginator';
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-job-applicants',
    standalone: true,
    templateUrl: './job-applicants.component.html',
    styleUrl: './job-applicants.component.scss',
    imports: [CommonModule, RecruiterSidebarComponent, FooterComponent, RecruiterHeaderComponent,MatPaginator,ToastrModule]
})
export class JobApplicantsComponent implements OnInit{

    candidates: any[] = [];
    displayedCandidates: any[] = [];
    length = 0;
    pageSize = 2;
    pageIndex = 0;
    pageSizeOptions = [2, 3, 4];

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private recruiterService:RecruiterService,private toastr:ToastrModule,private router:Router,private http:HttpClient){}

    ngOnInit(): void {
      const jobId = localStorage.getItem('jobId')
      if(jobId){
      this.recruiterService.getApplications(jobId).subscribe((response)=>{
        this.candidates = response.data
        console.log(this.candidates);
        
        this.updateDisplayedJobs();
      })
    }
  }


  

  updateResumeViewed(candidateId: string) {
    return this.http.put(`/api/candidates/${candidateId}/updateResumeViewed`, {});
  }


  updateDisplayedJobs(): void {
    const start = this.pageIndex * this.pageSize;
    const end = Math.min(start + this.pageSize, this.length);
    this.displayedCandidates = this.candidates.slice(start, end);
  }

  handlePageEvent(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedJobs();
  }
}
