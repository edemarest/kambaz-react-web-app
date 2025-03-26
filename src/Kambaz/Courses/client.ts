import axios from "axios";

axios.defaults.withCredentials = true;

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

export const findAllCourses = async () => {
  const response = await axios.get(COURSES_API);
  return response.data;
};

export const createCourse = async (course: Course) => {
  const response = await axios.post(COURSES_API, course);
  return response.data;
};

export const updateCourse = async (courseId: string, course: Course) => {
  const response = await axios.put(`${COURSES_API}/${courseId}`, course);
  return response.data;
};

export const deleteCourse = async (courseId: string) => {
  const response = await axios.delete(`${COURSES_API}/${courseId}`);
  return response.data;
};

export const findMyCourses = async () => {
  const response = await axios.get(`${USERS_API}/courses`);
  return response.data;
};
