import axios from "axios";

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ENROLLMENTS_API = `${API_BASE}/api`;

const AXIOS_CONFIG = { withCredentials: true };

export const getUserEnrollments = async () => {
  const response = await axios.get(`${ENROLLMENTS_API}/enrollments`, AXIOS_CONFIG);
  return response.data;
};

export const enrollInCourse = async (courseId: string) => {
  const response = await axios.post(`${ENROLLMENTS_API}/courses/${courseId}/enroll`, {}, AXIOS_CONFIG);
  return response.data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const response = await axios.delete(`${ENROLLMENTS_API}/courses/${courseId}/unenroll`, AXIOS_CONFIG);
  return response.data;
};
