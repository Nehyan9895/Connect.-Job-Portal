import { Component, Input } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JobTypePipe } from "../../../pipes/job-type.pipe";

@Component({
    selector: 'app-applications',
    standalone: true,
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss',
    imports: [FooterComponent, RecruiterHeaderComponent, RecruiterSidebarComponent, CommonModule, JobTypePipe]
})
export class ApplicationsComponent {
  jobs: any[] = [];


    isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  applications: any[] = []; // Define applications array to store fetched data

  constructor(private recruiterService: RecruiterService, private toastr:ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.jobs = this.recruiterService.getJobsLocal();

  }

  getApplicationsByRecruiter(jobId: string) {
    localStorage.setItem('jobId',jobId)
    this.router.navigate(['/recruiter/applicants'])
  }


}
