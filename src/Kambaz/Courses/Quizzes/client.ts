import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const QUIZ_API = `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes`;
const COURSE_API = `${import.meta.env.VITE_REMOTE_SERVER}/api/courses`;

export const findQuizzesForCourse = async (courseId: any) => {
  try {
    const response = await axiosWithCredentials.get(`${COURSE_API}/${courseId}/quizzes`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const findQuizById = async (quizId: any) => {
  try {
    const response = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createQuiz = async (courseId: any, quiz: any) => {
  try {
    const response = await axiosWithCredentials.post(`${COURSE_API}/${courseId}/quizzes`, quiz);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateQuiz = async (quizId: any, updates: any) => {
  try {
    const response = await axiosWithCredentials.put(`${QUIZ_API}/${quizId}`, updates);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteQuiz = async (quizId: any) => {
  try {
    const response = await axiosWithCredentials.delete(`${QUIZ_API}/${quizId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

interface TogglePublishPayload {
  publish: boolean;
}

export const togglePublish = async (quizId: string, publish: boolean): Promise<any> => {
  try {
    const response = await axiosWithCredentials.patch<{ data: any }>(`${QUIZ_API}/${quizId}/publish`, { publish } as TogglePublishPayload);
    return response.data;
  } catch (err) {
    throw err;
  }
};