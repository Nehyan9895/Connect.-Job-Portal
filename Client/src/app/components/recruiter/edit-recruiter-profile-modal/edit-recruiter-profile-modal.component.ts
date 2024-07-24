import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EditProfileModalComponent } from '../../candidate/edit-profile-modal/edit-profile-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IRecruiter } from '../../../models/recruiter.model';
import { Recruiter } from '../../../models/job.model';

@Component({
  selector: 'app-edit-recruiter-profile-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-recruiter-profile-modal.component.html',
  styleUrl: './edit-recruiter-profile-modal.component.scss'
})
export class EditRecruiterProfileModalComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {profileData:Recruiter}
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      companyName: ['', Validators.required],
      phone: ['', Validators.required],
      companyLocations: ['', Validators.required], // Handle as a string input
    });

    if (data && data.profileData) {
      this.profileForm.patchValue(data.profileData);
      this.profileForm.get('companyLocations')?.setValue(data.profileData.companyLocations.join(', '));
    }
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      // Convert companyLocations back to an array
      formValue.companyLocations = formValue.companyLocations.split(',').map((location: string) => location.trim());
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
