import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

const API_BASE = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4000";
const MODULES_API = `${API_BASE}/api`;

export const fetchModulesForCourse = async (courseId: string) => {
    const url = `${MODULES_API}/courses/${courseId}/modules`;
    const response = await axiosWithCredentials.get(url);
    return response.data;
  };
  

export const createModule = async (courseId: string, module: any) => {
  const response = await axiosWithCredentials.post(`${MODULES_API}/courses/${courseId}/modules`, module);
  return response.data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/modules/${moduleId}`);
  return response.data;
};

export const updateModule = async (moduleId: string, updates: any) => {
  const response = await axiosWithCredentials.put(`${MODULES_API}/modules/${moduleId}`, updates);
  return response.data;
};

