import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const SUBMISSION_API = `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes`;

export const submitQuizAnswers = async (quizId: string, userId: string, answers: any) => {
    try {
        const response = await axiosWithCredentials.post(
            `${SUBMISSION_API}/${quizId}/submit`,
            { userId, answers }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const getAllSubmissionsForQuiz = async (quizId: any) => {
    try {
        const response = await axiosWithCredentials.get(`${SUBMISSION_API}/${quizId}/submissions`);
        return response.data;
    } catch (err) {
        throw err;
    }
};

export const findSubmissionsForUserQuiz = async (quizId: string) => {
    try {
        const response = await axiosWithCredentials.get(
            `${SUBMISSION_API}/${quizId}/submissions/me`
        );

        if (!response.data.exists) {
            return null;
        }

        return response.data.submission;
    } catch (err) {
        throw err;
    }
};
