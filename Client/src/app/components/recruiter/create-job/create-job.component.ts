import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { allSkills } from '../../../constants/skills.constant';



@Component({
    selector: 'app-create-job',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    templateUrl: './create-job.component.html',
    styleUrl: './create-job.component.scss',
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
      MatDatepickerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateJobComponent implements OnInit {
  jobForm: FormGroup;
  allSkills = allSkills
  currentSkill = new FormControl('');
  filteredSkills: string[] = this.allSkills;
  companyLocations: string[] = [];


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private recruiterService: RecruiterService
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

    this.currentSkill.valueChanges.subscribe(value => this.filterSkills(value ?? ''));
  }

  ngOnInit(): void {
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

  jobProfile(): void {
    const email = localStorage.getItem('recruiterEmail');
    if (email) {
      this.recruiterService.createJob(email, this.jobForm.value).subscribe({
        next: (response) => {
          this.toastr.success(response.data.message, 'Success');
          this.router.navigate(['/recruiter/home']);
        },
        error: (error) => {
          this.toastr.error(error.error.error, 'Error');
          console.error(error);
        }
      });
    }
  }
}
