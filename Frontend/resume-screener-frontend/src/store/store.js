import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';
import jobReducer from './slices/jobSlice';
import candidatesReducer from './slices/candidatesSlice';
import applicationsReducer from './slices/applicationsSlice';
import authReducer from './slices/authSlice';
import recruiterReducer from './slices/recruiterSlice';
import jobDetailReducer from './slices/jobDetailSlice';
import candidateRankingReducer from './slices/candidateRankingSlice';
import candidateProfileReducer from './slices/candidateProfileSlice';
import browseJobsReducer from './slices/browseJobsSlice';
import myApplicationsReducer from './slices/myApplicationsSlice';
import jobApplyReducer from './slices/jobApplySlice';
import interviewReducer from './slices/interviewSlice';
import recruiterInterviewReducer from './slices/recruiterInterviewSlice';
import companyProfileReducer from './slices/companyProfileSlice';

export const store = configureStore({
  reducer: {
    recruiter: recruiterReducer,
    jobs: jobsReducer,
    job: jobReducer,
    jobDetail: jobDetailReducer,
    candidates: candidatesReducer,
    applications: applicationsReducer,
    auth: authReducer,
    candidateRanking: candidateRankingReducer,
    candidateProfile: candidateProfileReducer,
    browseJobs: browseJobsReducer,
    myApplications: myApplicationsReducer,
    interview: interviewReducer,
    jobApply: jobApplyReducer,
    recruiterInterview: recruiterInterviewReducer,
    companyProfile: companyProfileReducer,
  },
});