import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-schedule-interview-modal',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
],
  templateUrl: './schedule-interview-modal.component.html',
  styleUrl: './schedule-interview-modal.component.scss'
})
export class ScheduleInterviewModalComponent implements OnInit {
  scheduleForm: FormGroup;
  @Output() scheduleInterview = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleInterviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidate: any }
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.candidate) {
      // Initialize form or perform any setup based on the candidate data
      console.log(this.data.candidate); // For debugging
    }
  }

  submit() {
    if (this.scheduleForm.valid) {
      const interviewDetails = {
        ...this.scheduleForm.value,
        candidateId: this.data.candidate.candidate_id._id,
        jobId: this.data.candidate.job_id,
        jobApplicationId: this.data.candidate._id
      };
      this.scheduleInterview.emit(interviewDetails);
      this.dialogRef.close(); // Close the dialog after submission
    }
  }


}
