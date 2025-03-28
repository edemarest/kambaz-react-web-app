import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`; // Enrollments API

// Get all enrollments for the current user
export const getUserEnrollments = async () => {
  try {
    const response = await axios.get(`${ENROLLMENTS_API}`, { withCredentials: true });
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    throw new Error("Failed to fetch enrollments.");
  }
};

// Enroll the current user in a specific course
export const enrollInCourse = async (courseId: string) => {
  try {
    const response = await axios.post(`${ENROLLMENTS_API}/courses/${courseId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new Error("Failed to enroll in course.");
  }
};
