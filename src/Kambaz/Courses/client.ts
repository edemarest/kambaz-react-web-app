import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
export const COURSES_API = `${REMOTE_SERVER}/api/courses`;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export interface Course {
  _id?: string;
  name: string;
  number: string;
  startDate?: string;
  endDate?: string;
  image?: string;
}

// Fetch all courses
export const findAllCourses = async () => {
  const response = await axiosWithCredentials.get(COURSES_API);
  return response.data;
};

// Create a new course and enroll the current user in it
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

// Update an existing course
export const updateCourse = async (courseId: string, course: Course) => {
  const response = await axiosWithCredentials.put(`${COURSES_API}/${courseId}`, course);
  return response.data;
};

// Delete a course
export const deleteCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.delete(`${COURSES_API}/${courseId}`);
  return response.data;
};

// Fetch courses the current user is enrolled in
export const findMyCourses = async () => {
  const response = await axiosWithCredentials.get(`${USERS_API}/courses`);
  return response.data;
};

// Fetch modules for a specific course
export const findModulesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

// Fetch users enrolled in a specific course
export const findUsersForCourse = async (courseId: string) => {
  try {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching enrolled users:", error.response?.data || error.message);
    } else {
      console.error("Error fetching enrolled users:", error);
    }
    throw error;
  }
};

// ✅ Enroll in a course using correct backend route
export const enrollInCourse = async (courseId: string) => {
  try {
    const response = await axiosWithCredentials.post(
      `${REMOTE_SERVER}/api/courses/${courseId}/enroll`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw new Error("Failed to enroll in course.");
  }
};

// ✅ Unenroll from a course using correct backend route
export const unenrollFromCourse = async (courseId: string) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${REMOTE_SERVER}/api/courses/${courseId}/unenroll`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    throw new Error("Failed to unenroll from course.");
  }
};
