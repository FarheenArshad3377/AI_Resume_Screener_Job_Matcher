import axiosInstance from "./axiosInstance";

export const uploadResume = async (formData) => {
  const response = await axiosInstance.post("/candidates/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchCandidateById = async (id) => {
  const response = await axiosInstance.get(`/candidates/${id}`);
  return response.data;
};

export const fetchCandidates = async () => {
  const response = await axiosInstance.get("/candidates");
  return response.data;
};

// NEW FUNCTION
export const getCandidatesApi = async (jobId) => {
  const response = await axiosInstance.get(
    `/applications/by-job/${jobId}`
  );

  return response.data;
};