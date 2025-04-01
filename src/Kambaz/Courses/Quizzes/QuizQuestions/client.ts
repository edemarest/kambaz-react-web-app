import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const SUBMISSION_API = `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes`;
const QUIZ_API = `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes`;

export const submitQuiz = async (quizId: any, submission: any) => {
  try {
    const response = await axiosWithCredentials.post(
      `${SUBMISSION_API}/${quizId}/submissions`,
      submission,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getAllSubmissionsForQuiz = async (quizId: any) => {
  try {
    const response = await axiosWithCredentials.get(
      `${SUBMISSION_API}/${quizId}/submissions`,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const findQuestionsForQuiz = async (quizId: any) => {
  try {
    const response = await axiosWithCredentials.get(
      `${QUIZ_API}/${quizId}/questions`,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const updateQuestion = async (questionId: string, updated: any) => {
  try {
    const response = await axiosWithCredentials.put(
      `${import.meta.env.VITE_REMOTE_SERVER}/api/questions/${questionId}`,
      updated,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createQuestion = async (quizId: string, question: any) => {
  try {
    const response = await axiosWithCredentials.post(
      `${QUIZ_API}/${quizId}/questions`,
      question,
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${import.meta.env.VITE_REMOTE_SERVER}/api/questions/${questionId}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
