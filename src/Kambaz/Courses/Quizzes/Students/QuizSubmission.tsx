import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import * as questionClient from "../QuizQuestions/client";
import "../index.css";

export default function SubmissionView(props: {
  quiz?: any;
  submission?: any;
  embedded?: boolean;
}) {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = props.quiz ?? location.state?.quiz;
  const submission = props.submission ?? location.state?.submission;
  const embedded = props.embedded ?? false;
  const [questions, setQuestions] = useState<any[]>([]);

  const loadQuestions = async () => {
    const q = await questionClient.findQuestionsForQuiz(qid);
    setQuestions(q);
  };

  useEffect(() => {
    loadQuestions();
  }, [qid]);

  if (!quiz || !submission) {
    return <p className="text-danger">Submission or quiz data missing.</p>;
  }

  const formatAnswer = (q: any, answer: any) => {
    if (answer === undefined || answer === null) return "(No Answer)";
    switch (q.type) {
      case "MCQ":
        return typeof answer === "string"
          ? answer
          : (q.choices?.[answer] ?? "(Invalid choice)");
      case "TRUE_FALSE":
        return String(answer).toLowerCase() === "true" ? "True" : "False";
      case "FILL_BLANK":
        return String(answer).trim();
      default:
        return String(answer);
    }
  };

  const getCorrectAnswer = (q: any) => {
    switch (q.type) {
      case "MCQ":
        return q.choices?.[q.correctChoiceIndex] ?? "N/A";
      case "TRUE_FALSE":
        return q.correctAnswer === true ? "True" : "False";
      case "FILL_BLANK":
        return Array.isArray(q.acceptedAnswers)
          ? q.acceptedAnswers.join(", ")
          : (q.correctAnswer ?? "N/A");
      default:
        return "N/A";
    }
  };

  return (
    <div className="mt-5">
      {!embedded && (
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
        >
          ← Back to Quiz Details
        </button>
      )}

      <h4>Submission</h4>
      <p>
        <strong>Score:</strong> {submission.score} points
      </p>
      <p>
        <strong>Attempt:</strong> #{submission.attemptNumber}
      </p>

      <hr />
      {questions.map((q: any, index: number) => {
        const studentAns = submission.answers.find(
          (a: any) => a.questionId === q._id,
        );
        const isCorrect = studentAns?.isCorrect;

        return (
          <div key={q._id} className="mb-4 p-3 border rounded">
            <h5>
              Q{index + 1}. {q.title}{" "}
              {isCorrect ? (
                <span className="text-success">✔️ Correct</span>
              ) : (
                <span className="text-danger">❌ Incorrect</span>
              )}
            </h5>
            <div dangerouslySetInnerHTML={{ __html: q.questionText }} />
            <p>
              <strong>Your Answer:</strong>{" "}
              {formatAnswer(q, studentAns?.answer)}
            </p>
            {!isCorrect && (
              <p>
                <strong>Correct Answer:</strong> {getCorrectAnswer(q)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
