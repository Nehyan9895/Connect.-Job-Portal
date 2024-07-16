import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EducationData } from '../../../models/candidateData.interface';


@Component({
  selector: 'app-add-education-modal',
  standalone: true,
  imports: [MatDialogModule,CommonModule,MatInputModule,ReactiveFormsModule,FormsModule,],
  templateUrl: './add-education-modal.component.html',
  styleUrl: './add-education-modal.component.scss'
})
export class AddEducationModalComponent implements OnInit {
  educationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEducationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EducationData
  ) {
    this.educationForm = this.fb.group({
      qualification: ['', Validators.required],
      specialization: [''],
      nameOfInstitution: [''],
      passoutYear: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      passoutMonth: ['']
    });
    console.log(typeof data);
    

    if (data && data.education) {
      this.educationForm.patchValue(data.education);
    }
  }

  ngOnInit(): void {}

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.educationForm.valid) {
      this.dialogRef.close(this.educationForm.value);
    }
  }
}


