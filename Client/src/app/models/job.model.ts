export interface Job {
    job: {
      _id?: string;
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
    };
    matchScore: number;
  }
  
  export interface JobForApplication {
    id: string;
    title: string;
    status: string;
    statusClass?: string;
    logo?: string;
    company?: string; 
    location: string; 
    salaryMin: number; 
    salaryMax: number; 
    jobType: string; 
    jobMode: string; 
    experience: string; 
    skills: string[];
    description: string;
    responsibilities: string;
    preference: string;
  }
  

  export interface RawJobData {
    job_id: {
      _id: string;
      job_title: string;
      company?: string;
      job_location: string;
      salary_range_min: number;
      salary_range_max: number;
      job_type: string;
      job_mode: string;
      experience_required: string;
      skills_required: string[];
      description: string;
      responsibilities: string;
      preference: string;
    };
    result?: string;
    resume_viewed?: boolean;
    application_reviewed?: boolean;
    application_sent?: boolean;
  }
  
  // models/job.model.ts

export interface JobForApply {
  recruiter_id: string;
  job_id: string;
  job_title: string;
  job_location: string;
  salary_range_min: number;
  salary_range_max: number;
  job_type: 'full_time' | 'part_time' | 'contract_based';
  job_mode: 'remote' | 'office' | 'hybrid';
  experience_required: 'fresher' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
  skills_required: string[];
  last_date: Date;
  description: string;
  responsibilities: string;
  preference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
