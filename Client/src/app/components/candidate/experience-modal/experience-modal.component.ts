import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ExperienceData, ExperienceModalData } from '../../../models/candidateData.interface';

@Component({
  selector: 'app-experience-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatDialogModule,],
  templateUrl: './experience-modal.component.html',
  styleUrl: './experience-modal.component.scss'
})
export class ExperienceModalComponent implements OnInit {
  experienceForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExperienceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExperienceModalData
  ) {
    this.isEditMode = !!data.experience;
    this.experienceForm = this.fb.group({}); // Initialize as an empty form group
  }

  ngOnInit(): void {
    this.experienceForm = this.fb.group({
      jobRole: [{ value: '', disabled: false }, Validators.required],
      companyName: [{ value: '', disabled: false }, Validators.required],
      experienceDuration: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(/^\d+$/)]],
      isFresher: [false]
    });

    if (this.isEditMode) {
      this.experienceForm.patchValue(this.data.experience);
    }

    this.onIsFresherChange();

    // Disable form controls if isFresher is checked initially
    if (this.experienceForm.get('isFresher')?.value) {
      this.setFresherControlsState(true);
    }

    // Hide isFresher checkbox if there is one or more experience
    if (this.data.existingExperiences> 0) {
      this.experienceForm.get('isFresher')?.setValue(false);
    }
  }

  onIsFresherChange(): void {
    this.experienceForm.get('isFresher')?.valueChanges.subscribe((isFresher: boolean) => {
      this.setFresherControlsState(isFresher);
    });
  }

  setFresherControlsState(isFresher: boolean): void {
    const controls = ['jobRole', 'companyName', 'experienceDuration'];
    controls.forEach(control => {
      if (isFresher) {
        this.experienceForm.get(control)?.disable();
      } else {
        this.experienceForm.get(control)?.enable();
      }
    });
  }

  onSave(): void {
    if (this.experienceForm.invalid) {
      return;
    }
    this.dialogRef.close(this.experienceForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}




