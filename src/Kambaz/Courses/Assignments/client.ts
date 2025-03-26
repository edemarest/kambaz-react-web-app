import axios from "axios";

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const ASSIGNMENTS_API = `${API_BASE}/api`;

export const fetchAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/courses/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const response = await axios.post(`${ASSIGNMENTS_API}/courses/${courseId}/assignments`, assignment);
  return response.data;
};

export const updateAssignment = async (assignmentId: string, updates: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/assignments/${assignmentId}`, updates);
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/assignments/${assignmentId}`);
  return response.data;
};
