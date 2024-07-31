import { ChangeDetectionStrategy, Component, OnInit, computed, inject, model, signal } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { userService } from '../../../services/user.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../shared/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { allSkills } from '../../../constants/skills.constant';


@Component({
    selector: 'app-user-personal-profile',
    standalone: true,
    templateUrl: './user-personal-profile.component.html',
    styleUrl: './user-personal-profile.component.scss',
    imports: [
        CommonModule,
        FooterComponent,
        FormsModule,
        HttpClientModule,
        ToastrModule,
        ReactiveFormsModule,
        HeaderComponent,
        MatFormFieldModule, 
        MatChipsModule, 
        MatIconModule,
        MatAutocompleteModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})


export class UserPersonalProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentStep: number = 1;
  selectedFile: File | undefined;
  selectedFileName: string | null = null;
  selectedResume: File | undefined;
  selectedResumeName: string | null = null;
  imagePreview: string | null = null;

  allSkills = allSkills
  currentSkill = new FormControl('');
  filteredSkills: string[] = this.allSkills;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private userBackend: userService,
    private announcer: LiveAnnouncer
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
      dob: ['', Validators.required],
      upload: [null, Validators.required],
      gender: ['', Validators.required],
      qualification: ['', Validators.required],
      specialization: ['', Validators.required],
      institution: ['', Validators.required],
      passoutYear: ['', [Validators.pattern('^[0-9]{4}$')]],
      passoutMonth: ['', Validators.required],
      isFresher: [false, Validators.required],
      jobRole: ['', Validators.required],
      companyName: ['', Validators.required],
      experienceDuration: [0, [Validators.required, Validators.min(0)]],
      skills: this.fb.array([], Validators.required),
      resume: [null, Validators.required],
      newSkill: ['']
    });

    this.currentSkill.valueChanges.subscribe(value => this.filterSkills(value ?? ''));
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);

    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.profileForm.patchValue({
        upload: file
      });
      this.profileForm.get('upload')!.updateValueAndValidity();
    }
  }

  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
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
      this.announcer.announce(`Removed skill at index ${index}`);
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



  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getYearOptions(): number[] {
    const startYear = 1990;
    const endYear = new Date().getFullYear();
    let years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  }

  onResumeSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);

    if (file) {
      this.selectedResume = file;
      this.selectedResumeName = file.name;

      this.profileForm.patchValue({
        resume: file
      });
      this.profileForm.get('resume')!.updateValueAndValidity();
    }
  }


  candidateProfile(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly.', 'Error');
      return;
    }
  
    const email = localStorage.getItem('candidateEmail');
    if (email) {
      const formData = new FormData();
      formData.append('email', email);
  
      const candidateData = JSON.stringify(this.profileForm.value);
      formData.append('candidateData', candidateData);
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.selectedResume) {
        formData.append('resume', this.selectedResume);
      }
  
      console.log(formData);
      this.userBackend.profile(formData).subscribe({
        next: (response) => {
          this.toastr.success(response.data.message, 'Success');
          this.router.navigate(['/candidate/home']);
        },
        error: (error) => {
          this.toastr.error(error.error.message, 'Error');
          console.error(error);
        }
      });
    } else {
      this.toastr.error('Email not found. Please login again.', 'Error');
    }
  }

  
  
}
