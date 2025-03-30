import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as client from "./client";
import * as submissionClient from "./SubmissionView/client";
import * as questionClient from "./QuizQuestions/client";
import SubmissionView from "./Students/QuizSubmission";
import "./index.css";

export default function QuizDetails({ currentUser }: { currentUser: any }) {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const loadQuiz = async () => {
    const q = await client.findQuizById(qid);
    setQuiz(q);
    if (currentUser?.role === "STUDENT" && qid) {
      try {
        const result = await submissionClient.findSubmissionsForUserQuiz(qid);
        if (result) setSubmission(result);
      } catch (err) { }
    }
    const qs = await questionClient.findQuestionsForQuiz(qid);
    setQuestions(qs);
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  if (!quiz) return <p>Loading quiz...</p>;

  const isFaculty = currentUser?.role === "FACULTY";
  const attemptsAllowed = quiz.multipleAttempts ? quiz.allowedAttempts : 1;
  const isClosed = quiz.published === false;
  const attemptsUsed = submission?.attemptNumber || 0;
  const hasReachedMaxAttempts = attemptsUsed >= attemptsAllowed;
  const canTake = !hasReachedMaxAttempts && !isClosed;

  const showTakeDisabledMsg = hasReachedMaxAttempts
    ? "You have reached the maximum number of attempts."
    : isClosed
      ? "This quiz is not currently available."
      : "";

  const formatDateTime = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          ← Back
        </button>

        <div>
          {isFaculty ? (
            <>
              <button className="btn btn-danger me-2" onClick={async () => {
                if (window.confirm("Are you sure you want to delete this quiz?")) {
                  await client.deleteQuiz(qid);
                  navigate(`/Kambaz/Courses/${cid}/Quizzes`);
                }
              }}>
                Delete Quiz
              </button>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Preview`)}
              >
                Preview Quiz
              </button>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit/Details`)}
              >
                Edit Quiz
              </button>
              <button
                className={`btn me-2 ${quiz.published ? "btn-outline-primary" : "btn-success"}`}
                onClick={async () => {
                  await client.updateQuiz(qid, { ...quiz, published: !quiz.published });
                  loadQuiz();
                }}
              >
                {quiz.published ? "Unpublish" : "Publish"}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-danger me-2"
                disabled={!canTake}
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Take`)}
              >
                Take Quiz
              </button>
              {showTakeDisabledMsg && (
                <div className="text-muted small">{showTakeDisabledMsg}</div>
              )}
            </>
          )}
        </div>
      </div>
      <hr />
      <h2 className="mb-1">{quiz.title}</h2>
      <p className="text-muted">{quiz.description}</p>
      <hr />
      <table className="table table-borderless w-auto mb-4">
        <tbody>
          <tr>
            <td><strong>Quiz Type</strong></td>
            <td>{quiz.quizType}</td>
          </tr>
          <tr>
            <td><strong>Points</strong></td>
            <td>{quiz.points ?? 0}</td>
          </tr>
          <tr>
            <td><strong>Assignment Group</strong></td>
            <td>{quiz.assignmentGroup}</td>
          </tr>
          <tr>
            <td><strong>Shuffle Answers</strong></td>
            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Time Limit</strong></td>
            <td>{quiz.hasTimeLimit ? `${quiz.timeLimit} Minutes` : "None"}</td>
          </tr>
          <tr>
            <td><strong>Multiple Attempts</strong></td>
            <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Show Correct Answers</strong></td>
            <td>{quiz.showCorrectAnswers ? "Immediately" : "No"}</td>
          </tr>
          <tr>
            <td><strong>One Question at a Time</strong></td>
            <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Webcam Required</strong></td>
            <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Lock Questions After Answering</strong></td>
            <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Access Code</strong></td>
            <td>{quiz.accessCode || "None"}</td>
          </tr>
          <tr>
            <td><strong>Published</strong></td>
            <td>{quiz.published ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td><strong>Total Questions</strong></td>
            <td>{questions.length}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <table className="table table-sm w-auto">
        <thead>
          <tr>
            <th>Due</th>
            <th>Available From</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDateTime(quiz.dueDate)}</td>
            <td>{formatDateTime(quiz.availableFrom)}</td>
            <td>{formatDateTime(quiz.availableUntil)}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      {submission && (
        <SubmissionView
          quiz={quiz}
          submission={submission}
          embedded={true}
        />
      )}
    </div>
  );
}
