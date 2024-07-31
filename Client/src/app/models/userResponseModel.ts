export interface ResponseModel<T> {
    status: 'success' | 'error';
    data: T;
    message?: string;
    error?: string;
  }
  

  export interface SignupResponse {
    message: string;
    otpToken: string;
  }
  
  export interface VerifyOtpResponse {
    message: string;
  }
  
  export interface ResendOtpResponse {
    message: string;
    newOtpToken: string;
  }
  

  export interface LoginResponse {
    token: string;
    user: {
      id: string;
      image: string;
      is_done: boolean;
    };
    message: string;
  }
  

  export interface ProfileResponse {
    message: string;
  }

  export interface JobApplyResponse {
    message: string;
  }

  export interface JobApplicationStatistics {
    jobsApplied: number;
    reviewed: number;
    resumeViewed: number;
    accepted: number;
    rejected: number;
}

export interface UserDetails {
  image: string;
  fullName: string;
}

export interface ForgetResponse {
  message: string;
  token: string;
}

export interface VerifyForgetResponse {
  message: string;
}