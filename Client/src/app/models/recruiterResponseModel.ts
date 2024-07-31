export interface CandidateDetails {
    user_id: string;
    fullName: string;
    phone: string;
    dob: Date;
    image: string;
    gender: string;
    education: Array<{
      qualification: string;
      specialization: string;
      nameOfInstitution: string;
      passoutYear: number;
      passoutMonth: string;
    }>;
    experience: Array<{
      isFresher: boolean;
      jobRole?: string;
      companyName?: string;
      experienceDuration?: number;
    }>;
    skills: string[];
    resume: string;
    _id:string
  }
  
  export interface JobDetails {
    recruiter_id: string;
    job_id: string;
    job_title: string;
    job_location: string;
    salary_range_min: number;
    salary_range_max: number;
    job_type: string;
    job_mode: string;
    experience_required: string;
    skills_required: string[];
    last_date: Date;
    description: string;
    responsibilities: string;
    preference?: string;
    _id:string
  }
  
  export interface JobApplicationDetails {
    candidate_id: CandidateDetails;
    job_id: JobDetails;
    application_sent: boolean;
    application_reviewed: boolean;
    resume_viewed: boolean;
    result: 'Result' | 'Accepted for Interview' | 'Rejected';
    _id:string
  }
  
  interface Recruiter {
    id: string;        // ID of the recruiter
    is_done: boolean;  // Flag indicating whether the profile is complete
    // Add other recruiter-specific fields as needed
  }
  
  export interface LoginResponseData {
    token: string;            // JWT token for authentication
    recruiter: Recruiter;     // Recruiter information
    message: string;          // Message from the server
  }

  export interface RecruiterProfile {
    message: string;            
  }

  export interface RecruiterProfileFull {
    fullName: string;
    companyName: string;
    phone: string;
    image?: string;                  // Optional field for profile image URL
    companyLocations: string[];
    _id:string   
    user_id:string
  }
  
  export interface UpdateApplicationReviewedResponse {
    message: string; // Adjust based on actual response structure
  }
  
  