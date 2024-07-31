import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { JobApplicationDetails } from '../../../models/recruiterResponseModel';
import { InterviewDetails } from '../../../models/interviewModel';

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
  @Output() scheduleInterview = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleInterviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidate: JobApplicationDetails }
  ) {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.candidate) {
      console.log(this.data.candidate); // For debugging
    }
  }

  submit() {
    if (this.scheduleForm.valid) {
      const interviewDetails:InterviewDetails = {
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
