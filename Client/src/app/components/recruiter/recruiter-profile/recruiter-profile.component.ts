import { Component } from '@angular/core';
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterService } from '../../../services/recruiter.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { popularLocationsInIndia } from '../../../constants/locations.constant';

@Component({
    selector: 'app-recruiter-profile',
    standalone: true,
    templateUrl: './recruiter-profile.component.html',
    styleUrl: './recruiter-profile.component.scss',
    imports: [
        RecruiterHeaderComponent, 
        FooterComponent, 
        ReactiveFormsModule, 
        CommonModule, 
        RecruiterSidebarComponent,
        MatFormFieldModule, 
        MatChipsModule, 
        MatIconModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,

    ]
})
export class RecruiterProfileComponent {

    profileForm: FormGroup;
    selectedFile: File | undefined;
    selectedFileName: string | null = null;
    imagePreview: string | null = null;

    allLocations = popularLocationsInIndia
    currentLocation = new FormControl('');
    filteredLocations: string[] = this.allLocations;

    constructor(
        private recruiterService: RecruiterService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private router: Router) {
            this.profileForm = this.fb.group({
                fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]+$/)]],
                phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]],
                upload: [null, Validators.required],
                companyName: ['', Validators.required],
                companyLocations: this.fb.array([], Validators.required)
            });

            this.currentLocation.valueChanges.subscribe(value => this.filterLocations(value ?? ''));
        }

    get companyLocations(): FormArray {
        return this.profileForm.get('companyLocations') as FormArray;
    }


    onFileSelected(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const file = inputElement.files ? inputElement.files[0] : null;
        if (file) {
            this.selectedFile = file;
            this.selectedFileName = file.name;
    
            // Show image preview
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
    


    addLocationFromInput(event?: MatChipInputEvent): void {
        const inputElement = event?.chipInput.inputElement;
        const value: string = (event?.value || this.currentLocation.value || '').trim();

        if (value && !this.companyLocations.controls.some(control => control.value.toLowerCase() === value.toLowerCase())) {
            this.companyLocations.push(new FormControl(value, Validators.required));
            this.currentLocation.setValue('');
        }

        event?.chipInput!.clear();
        if (inputElement) {
            inputElement.value = '';
        }
    }

    removeLocation(index: number): void {
        if (index >= 0) {
            this.companyLocations.removeAt(index);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const value = event.option.viewValue;
        if (!this.companyLocations.controls.some(control => control.value.toLowerCase() === value.toLowerCase())) {
            this.companyLocations.push(new FormControl(value, Validators.required));
        }
        this.currentLocation.setValue('');
    }

    filterLocations(value: string): void {
        const filterValue = value.toLowerCase();
        this.filteredLocations = this.allLocations.filter(location => location.toLowerCase().includes(filterValue));
    }

    recruiterProfile(): void {
        // Existing method logic here
        const email = localStorage.getItem('recruiterEmail');

        const formData = new FormData();
        if(email){
            formData.append('email', email);
        }
        // Append each form control value to FormData
        for (const key in this.profileForm.value) {
            if (key === 'upload' && this.selectedFile) {
                formData.append('upload', this.selectedFile);
            } else if (key === 'companyLocations') {
                this.profileForm.value[key].forEach((location: string, index: number) => {
                    formData.append(`candidateData[companyLocations][${index}]`, location);
                });
            } else {
                formData.append(`candidateData[${key}]`, this.profileForm.value[key]);
            }
        }

        this.recruiterService.profile(formData).subscribe({
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
