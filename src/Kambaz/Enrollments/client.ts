import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
import { USERS_API } from "../Account/client";
export const REMOTE_SERVER =
  import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`; // Enrollments API

export const getUserEnrollments = async () => {
  try {
    const response = await axiosWithCredentials.get(ENROLLMENTS_API);
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    throw new Error("Failed to fetch enrollments.");
  }
};

export const enrollInCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/current/courses/${courseId}`,
    {},
  );
  return response.data;
};
