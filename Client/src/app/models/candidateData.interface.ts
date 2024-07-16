export interface EducationData {
    education: {
      qualification: string;
      specialization?: string;
      nameOfInstitution?: string;
      passoutYear: string;
      passoutMonth?: string;
    };
  }
  

  export interface BasicCandidateData{
    fullName: string;
    phone: string;
    dob: Date;
    gender: string;
  }

export interface ExperienceData {
    jobRole: string;
    companyName: string;
    experienceDuration: number;
    isFresher: boolean;
  }

  export interface ExperienceModalData {
    experience: ExperienceData;
    existingExperiences: number;
  }
  
  export interface Education {
    qualification: string;
    specialization?: string;
    nameOfInstitution?: string;
    passoutYear: string;
    passoutMonth?: string;
  }
  
  
  export interface CandidateData {
    dob: string;
    education: Education[];
    experience: ExperienceData[];
    fullName: string;
    gender: string;
    image: string;
    phone: string;
    resume: string;
    skills: string[];
    user_id: string;
    __v: number;
    _id: string;
  }
  
export type CandidateDetail = Education | ExperienceData;
