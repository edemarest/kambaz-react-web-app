import { useEffect, useState } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import * as client from "./client";
import * as questionClient from "./QuizQuestions/client";

import QuizDetails from "./QuizDetails";
import QuizPreview from "./QuizPreview";
import TakeQuiz from "./Students/TakeQuiz";
import SubmissionView from "./Students/QuizSubmission";
import QuizEditorWrapper from "./Faculty/Editor/QuizEditorWrapper";
import QuizList from "./QuizList";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  createdBy: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  allowedAttempts: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
  published: boolean;
  points?: number;
}

interface Question {
  _id: string;
  title: string;
  questionText: string;
  type: string;
  points: number;
}

export default function Quiz({ currentUser }: { currentUser: any }) {
  const { cid } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questionsMap, setQuestionsMap] = useState<{ [key: string]: Question[] }>({});

  const fetchQuizzes = async () => {
    try {
      const data = await client.findQuizzesForCourse(cid as string);
      setQuizzes(data);

      const map: { [key: string]: Question[] } = {};
      for (const quiz of data) {
        try {
          const questions = await questionClient.findQuestionsForQuiz(quiz._id);
          map[quiz._id] = questions;
        } catch (err) {
          console.error(`❌ Error fetching questions for ${quiz._id}`, err);
        }
      }
      setQuestionsMap(map);
    } catch (err) {
      console.error("❌ Error fetching quizzes", err);
    }
  };

  useEffect(() => {
    if (cid) fetchQuizzes();
  }, [cid]);

  return (
    <Routes>
      <Route
        index
        element={
          <QuizList
            quizzes={quizzes}
            currentUser={currentUser}
            questionsMap={questionsMap}
            refresh={fetchQuizzes}
          />
        }
      />
      <Route path="new" element={<QuizEditorWrapper isNew={true} />} />
      <Route path=":qid/Edit/Details" element={<QuizEditorWrapper isNew={false} />} />
      <Route path=":qid/Preview" element={<QuizPreview />} />
      <Route path=":qid/Take" element={<TakeQuiz currentUser={currentUser} />} />
      <Route path=":qid/Submission" element={<SubmissionView />} />
      <Route path=":qid" element={<QuizDetails currentUser={currentUser} />} />
    </Routes>
  );
}
