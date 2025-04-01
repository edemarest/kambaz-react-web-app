import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as quizClient from "../client";
import * as questionClient from "../QuizQuestions/client";
import * as submissionClient from "../SubmissionView/client";
import FillInTheBlankQuestion from "../QuizQuestions/FillInTheBlankQuestion";
import MultipleChoiceQuestion from "../QuizQuestions/MultipleChoiceQuestion";
import TrueFalseQuestion from "../QuizQuestions/TrueFalseQuestion";
import "../index.css";

interface Question {
  _id: string;
  title: string;
  questionText: string;
  type: string;
  points: number;
  choices?: string[];
  correctAnswer: string | string[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  allowMultipleAttempts: boolean;
  maxAttempts: number;
}

export default function TakeQuiz({ currentUser }: { currentUser: any }) {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  const loadQuiz = async () => {
    const q = await quizClient.findQuizById(qid);
    setQuiz(q);
    const qs = await questionClient.findQuestionsForQuiz(qid);
    setQuestions(qs);
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormComplete = () => {
    return questions.every(
      (q) => answers[q._id] !== undefined && answers[q._id] !== "",
    );
  };

  const handleSubmit = async () => {
    try {
      await submissionClient.submitQuizAnswers(
        qid as string,
        currentUser._id,
        answers,
      );
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
    } catch (err) {
      console.error("❌ Submission failed:", err);
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>

      <h3 className="quiz-question-title">{quiz.title}</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.map((q, index) => (
          <div key={q._id} className="quiz-question-box">
            <div className="quiz-question-header">
              <strong>
                Question {index + 1}. {q.title}
              </strong>
              <span>{q.points} pts</span>
            </div>
            <div className="quiz-question-body">
              <div dangerouslySetInnerHTML={{ __html: q.questionText }} />
              {q.type === "MCQ" && (
                <MultipleChoiceQuestion
                  question={q}
                  answer={answers[q._id]}
                  onAnswer={(val) => handleAnswer(q._id, val)}
                  complete={false}
                />
              )}

              {q.type === "TRUE_FALSE" && (
                <TrueFalseQuestion
                  question={q}
                  answer={answers[q._id]}
                  onAnswer={(val) => handleAnswer(q._id, val)}
                  complete={false}
                />
              )}

              {q.type === "FILL_BLANK" && (
                <FillInTheBlankQuestion
                  question={q}
                  answer={answers[q._id]}
                  onAnswer={(val) => handleAnswer(q._id, val)}
                  complete={false}
                />
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="btn btn-success"
          disabled={!isFormComplete()}
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
