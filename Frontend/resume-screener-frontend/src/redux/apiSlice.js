import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://recruitpro-api.runasp.net/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Job', 'Candidate', 'Application', 'Interview', 'CompanyProfile', 'Recruiter'],
  endpoints: () => ({}), // endpoints alag files mein injectEndpoints se add honge
});