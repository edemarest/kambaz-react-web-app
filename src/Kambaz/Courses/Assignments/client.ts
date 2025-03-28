import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ASSIGNMENTS_API = `${API_BASE}/api`;

export const fetchAssignmentsForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(
    `${ASSIGNMENTS_API}/courses/${courseId}/assignments`,
  );
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const response = await axiosWithCredentials.post(
    `${ASSIGNMENTS_API}/courses/${courseId}/assignments`,
    assignment,
  );
  return response.data;
};

export const updateAssignment = async (assignmentId: string, updates: any) => {
  const response = await axiosWithCredentials.put(
    `${ASSIGNMENTS_API}/assignments/${assignmentId}`,
    updates,
  );
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(
    `${ASSIGNMENTS_API}/assignments/${assignmentId}`,
  );
  return response.data;
};
