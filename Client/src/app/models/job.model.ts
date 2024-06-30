export interface Job {
    job: {
      _id: string;
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
  