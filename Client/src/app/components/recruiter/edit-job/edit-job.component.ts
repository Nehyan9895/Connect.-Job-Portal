import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruiterService } from '../../../services/recruiter.service';
import { ActivatedRoute } from '@angular/router';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { allSkills } from '../../../constants/skills.constant';

@Component({
    selector: 'app-edit-job',
    standalone: true,
    templateUrl: './edit-job.component.html',
    styleUrl: './edit-job.component.scss',
    imports: [
      FooterComponent, 
      RecruiterHeaderComponent, 
      RecruiterSidebarComponent,
      ReactiveFormsModule,
      CommonModule,
      MatFormFieldModule, 
      MatChipsModule, 
      MatIconModule,
      MatAutocompleteModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditJobComponent implements OnInit {
  jobForm: FormGroup;
  jobId: string | null;
  allSkills = allSkills
  currentSkill = new FormControl('');
  filteredSkills: string[] = this.allSkills;
  companyLocations: string[] = [];

  constructor(
    private recruiterService: RecruiterService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.fb.group({
      job_title: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      job_location: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      salary_range_min: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      salary_range_max: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      job_type: ['', [Validators.required]],
      job_mode: ['', [Validators.required]],
      experience_required: ['', [Validators.required]],
      skills: this.fb.array([], Validators.required),
      newSkill: [''],
      last_date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      responsibilities: ['', [Validators.required]],
      preference: ['']
    });
    this.jobId = localStorage.getItem('job_id');
    this.currentSkill.valueChanges.subscribe(value => this.filterSkills(value ?? ''));
  }

  // Getter for easy access to skills FormArray
  get skills(): FormArray {
    return this.jobForm.get('skills') as FormArray;
  }

  addSkillFromInput(event?: MatChipInputEvent): void {
    const inputElement = event?.chipInput.inputElement;
    const value: string = (event?.value || this.currentSkill.value || '').trim();

    if (value && !this.skills.controls.some(control => control.value.toLowerCase() === value.toLowerCase())) {
      this.skills.push(new FormControl(value, Validators.required));
      this.currentSkill.setValue('');
    }

    event?.chipInput!.clear();
    if (inputElement) {
      inputElement.value = '';
    }
  }

  removeSkill(index: number): void {
    if (index >= 0) {
      this.skills.removeAt(index);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.skills.controls.some(control => control.value.toLowerCase() === value.toLowerCase())) {
      this.skills.push(new FormControl(value, Validators.required));
    }
    this.currentSkill.setValue('');
  }

  filterSkills(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredSkills = this.allSkills.filter(skill => skill.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    if (this.jobId) {
      this.recruiterService.getJobByJobID(this.jobId).subscribe((job) => {
        console.log('job',job.data);
        const formattedLastDate = formatDate(job.data.last_date, 'yyyy-MM-dd', 'en-US');

        this.jobForm.patchValue({
          job_title: job.data.job_title,
          job_location: job.data.job_location,
          salary_range_min: job.data.salary_range_min,
          salary_range_max: job.data.salary_range_max,
          job_type: job.data.job_type,
          job_mode: job.data.job_mode,
          experience_required: job.data.experience_required,
          last_date: formattedLastDate,
          description: job.data.description,
          responsibilities: job.data.responsibilities,
          preference: job.data.preference
        });

        job.data.skills_required.forEach((skill: string) => {
          this.skills.push(new FormControl(skill, Validators.required));
        });
      });
    }

    this.fetchCompanyLocations();
  }


  fetchCompanyLocations(): void {
    const userId = localStorage.getItem('recruiter_id') as string
    this.recruiterService.getCompanyLocations(userId).subscribe({
      next: (response) => {
        this.companyLocations = response.data; // Update this line based on your response structure
      },
      error: (error) => {
        this.toastr.error('Failed to load company locations', 'Error');
        console.error(error);
      }
    });
  }
    updateJob() {
      if (this.jobForm.invalid) {
        this.jobForm.markAllAsTouched();
        return;
      }
  
      const updatedJobData = {
        job_id:this.jobId,
        job_title: this.jobForm.get('job_title')?.value,
        job_location: this.jobForm.get('job_location')?.value,
        salary_range_min: this.jobForm.get('salary_range_min')?.value,
        salary_range_max: this.jobForm.get('salary_range_max')?.value,
        job_type: this.jobForm.get('job_type')?.value,
        job_mode: this.jobForm.get('job_mode')?.value,
        experience_required: this.jobForm.get('experience_required')?.value,
        last_date: this.jobForm.get('last_date')?.value,
        description: this.jobForm.get('description')?.value,
        responsibilities: this.jobForm.get('responsibilities')?.value,
        preference: this.jobForm.get('preference')?.value,
        skills: this.skills.value
      };
      console.log(updatedJobData);
      
  
      this.recruiterService.updateJob(updatedJobData).subscribe({
        next:(response)=>{
          console.log(response);
          
          console.log('Job updated successfully', response);
          this.toastr.success(response.data.message,'Success')
          this.router.navigate(['/recruiter/home']); // Navigate to job list or another relevant page
        },
        error:(error)=>{
          console.log(error);
          
          this.toastr.error(error.error.error,'Error')
        }
    });
    }
}
