// interview.interface.ts

export interface Interview {
    date: Date; // Assuming `date` is a Date object; adjust if it's a string
    jobId: {
      job_id: string;
      job_title: string;
    };
    candidateId: {
      fullName: string;
      user_id:string
    };
    roomId:string
    time: string; // Adjust type if time is represented differently
  }
  
  export interface InterviewDetails {
    candidateId: string;      // ID of the candidate
    jobId: string;            // ID of the job
    jobApplicationId: string; // ID of the job application
    interviewDate?: Date;    // Optional: Date of the interview
    interviewTime?: string;  // Optional: Time of the interview (e.g., '10:00 AM')
    location?: string;       // Optional: Location of the interview (e.g., 'Conference Room A')
    additionalNotes?: string; // Optional: Any additional notes or comments
  }
  