import { Component, Input } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JobTypePipe } from "../../../pipes/job-type.pipe";
import { JobPosting } from '../../../models/job.model';

@Component({
    selector: 'app-applications',
    standalone: true,
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss',
    imports: [FooterComponent, RecruiterHeaderComponent, RecruiterSidebarComponent, CommonModule, JobTypePipe]
})
export class ApplicationsComponent {
  jobs: JobPosting[] = [];


    isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  constructor(private recruiterService: RecruiterService, private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.jobs = this.recruiterService.getJobsLocal();
    console.log(this.jobs);
    
  }

  getApplicationsByRecruiter(jobId: string) {
    localStorage.setItem('jobId',jobId)
    this.router.navigate(['/recruiter/applicants'])
  }


}
