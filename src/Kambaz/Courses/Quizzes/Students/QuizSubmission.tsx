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
      <p><strong>Score:</strong> {submission.score} points</p>
      <p><strong>Attempt:</strong> #{submission.attemptNumber}</p>

      <hr />
      {questions.map((q: any, index: number) => {
        const studentAns = submission.answers.find((a: any) => a.questionId === q._id);
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
            <p>{q.questionText}</p>
            <p><strong>Your Answer:</strong> {studentAns?.answer ?? "(No Answer)"}</p>
            {!isCorrect && (
              <p><strong>Correct Answer:</strong> {
                q.type === "MCQ"
                  ? q.choices?.[q.correctChoiceIndex]
                  : q.correctAnswer?.toString() ?? "N/A"
              }</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
