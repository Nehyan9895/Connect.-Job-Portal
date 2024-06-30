import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterService } from '../../../services/recruiter/recruiter.service';
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
  allSkills: string[] = ['Angular', 'React', 'NgRx', 'TypeScript']; // Your skills array
  currentSkill = new FormControl('');
  filteredSkills: string[] = this.allSkills;

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

  ngOnInit(): void {}

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
