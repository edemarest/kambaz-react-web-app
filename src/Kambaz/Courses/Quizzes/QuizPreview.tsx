import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiRedo, BiError } from "react-icons/bi";
import * as quizClient from "./SubmissionView/submissionClient";
import * as questionClient from "./QuizQuestions/client";
import FillInTheBlankQuestion from "./QuizQuestions/FillInTheBlankQuestion";
import MultipleChoiceQuestion from "./QuizQuestions/MultipleChoiceQuestion";
import TrueFalseQuestion from "./QuizQuestions/TrueFalseQuestion";
import "./index.css";

interface Question {
  _id: string;
  title: string;
  questionText: string;
  type: string;
  points: number;
  choices?: string[];
  correctChoiceIndex?: number;
  correctAnswer?: boolean;
  acceptedAnswers?: string[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  quizType: string;
  multipleAttempts: boolean;
  allowedAttempts: number;
}

export default function PreviewQuiz() {
  const { qid } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  const checkAnswerCorrectness = (q: Question, ans: any): boolean => {
    if (q.type === "MCQ") return q.correctChoiceIndex === ans;
    if (q.type === "TRUE_FALSE") return q.correctAnswer === ans;
    if (q.type === "FILL_BLANK") {
      return q.acceptedAnswers?.some(
        (correct) => correct.toLowerCase().trim() === ans?.toLowerCase().trim()
      ) ?? false;
    }
    return false;
  };

  const triggerError = (msg: string) => {
    setError(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setError(null), 6000);
  };

  const handleSubmit = () => {
    const isIncomplete = questions.some((q) => answers[q._id] === undefined || answers[q._id] === "");
    if (isIncomplete) {
      triggerError("Please answer all questions before submitting.");
      return;
    }

    setError(null);
    let total = 0;
    questions.forEach((q) => {
      const userAns = answers[q._id];
      const correct = checkAnswerCorrectness(q, userAns);
      if (correct) total += q.points;
    });
    setScore(total);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    if (!isSubmitted) {
      triggerError("You cannot retry until you have submitted the quiz.");
      return;
    }

    setError(null);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!quiz) return <p>Loading quiz preview...</p>;

  const renderButtons = () => (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <button
        className="btn btn-outline-secondary me-auto"
        onClick={() => window.history.back()}
      >
        ← Back
      </button>
      <div className="d-flex">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={handleRetry}
        >
          <BiRedo className="me-1" /> Retry
        </button>
        {!isSubmitted && (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      {renderButtons()}

      <h3 className="quiz-question-title">{quiz.title}</h3>
      {isSubmitted && (
        <div className="alert alert-success">Score: {score} points</div>
      )}
      <div className="preview-banner">
        <BiError className="me-2" /> This is a preview of the published version of the quiz
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.map((q, index) => {
          const userAns = answers[q._id];
          const isCorrect = checkAnswerCorrectness(q, userAns);

          return (
            <div key={q._id} className="quiz-question-box">
              <div className="quiz-question-header">
                <strong>Question {index + 1}</strong>
                <span>{q.points} pts</span>
              </div>
              <div className="quiz-question-body">
                <p className="mb-3">{q.questionText}</p>

                {q.type === "MCQ" && (
                  <MultipleChoiceQuestion
                    question={q}
                    answer={userAns}
                    onAnswer={(val) => handleAnswer(q._id, val)}
                    complete={isSubmitted}
                    readOnly={isSubmitted}
                    isCorrect={isCorrect}
                    correctAnswer={q.choices?.[q.correctChoiceIndex ?? 0]}
                  />
                )}

                {q.type === "TRUE_FALSE" && (
                  <TrueFalseQuestion
                    question={q}
                    answer={userAns}
                    onAnswer={(val) => handleAnswer(q._id, val)}
                    complete={isSubmitted}
                    readOnly={isSubmitted}
                    isCorrect={isCorrect}
                    correctAnswer={q.correctAnswer ? "true" : "false"}
                  />
                )}

                {q.type === "FILL_BLANK" && (
                  <FillInTheBlankQuestion
                    question={q}
                    answer={userAns}
                    onAnswer={(val) => handleAnswer(q._id, val)}
                    complete={isSubmitted}
                    readOnly={isSubmitted}
                    isCorrect={isCorrect}
                    correctAnswer={q.acceptedAnswers?.[0]}
                  />
                )}
              </div>
            </div>
          );
        })}
      </form>

      {renderButtons()}
    </div>
  );
}
