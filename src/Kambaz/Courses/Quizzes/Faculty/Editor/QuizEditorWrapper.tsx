import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import QuizEditorDetails from "./DetailsEditor";
import QuizEditorQuestions from "./QuestionEditor";
import * as client from "../../client";
import * as questionClient from "../../QuizQuestions/client";
import '../../index.css';

export default function QuizEditorWrapper({ isNew = false }: { isNew?: boolean }) {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const createdOnce = useRef(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"DETAILS" | "QUESTIONS">("DETAILS");
  const [error, setError] = useState<string | null>(null);

  const defaultQuiz = {
    title: "",
    description: "",
    quizType: "GRADED",
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    hasTimeLimit: true,
    timeLimit: 20,
    multipleAttempts: false,
    allowedAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    course: cid,
    published: false,
  };

  const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);

  const loadQuiz = async () => {
    try {
      if (isNew && cid && !createdOnce.current) {
        createdOnce.current = true;
        const created = await client.createQuiz(cid, defaultQuiz);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${created._id}/Edit/Details`, { replace: true });
        return;
      }

      if (qid) {
        const q = await client.findQuizById(qid);
        setQuiz(q);
        const qs = await questionClient.findQuestionsForQuiz(qid);
        setQuestions(qs);
        setOriginalQuestions(qs);
      }
    } catch (err) {
      setError("Failed to load or create quiz.");
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [qid]);

  const handleSave = async (publish = false) => {
    try {
      if (!qid || !quiz) return;

      const { _id, ...rest } = quiz;
      const updated = await client.updateQuiz(qid, {
        ...rest,
        published: publish ? true : quiz.published,
      });
      setQuiz(updated);

      const existingMap = new Map(originalQuestions.map((q) => [q._id, q]));

      for (const q of originalQuestions) {
        if (!questions.find((x) => x._id === q._id)) {
          await questionClient.deleteQuestion(q._id);
        }
      }

      for (const q of questions) {
        if (!q._id) {
          await questionClient.createQuestion(qid, q);
        } else {
          const original = existingMap.get(q._id);
          if (JSON.stringify(q) !== JSON.stringify(original)) {
            await questionClient.updateQuestion(q._id, q);
          }
        }
      }

      navigate(`/Kambaz/Courses/${cid}/Quizzes`, { state: { refresh: true } });
    } catch {
      setError("Error saving quiz.");
    }
  };

  const isFormValid = () => {
    if (!quiz) return false;
    const { title, description } = quiz;
    return typeof title === "string" && title.trim() !== "" &&
           typeof description === "string" && description.trim() !== "";
  };

  if (error) return <p className="text-danger">{error}</p>;
  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="quiz-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-danger">Quiz Editor</h4>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-blue me-2" disabled={!isFormValid()} onClick={() => handleSave(false)}>Save</button>
          <button className="btn btn-danger" disabled={!isFormValid()} onClick={() => handleSave(true)}>Save & Publish</button>
        </div>
      </div>

      <div className="quiz-tabs">
        <button className={activeTab === "DETAILS" ? "active" : ""} onClick={() => setActiveTab("DETAILS")}>Details</button>
        <button className={activeTab === "QUESTIONS" ? "active" : ""} onClick={() => setActiveTab("QUESTIONS")}>Questions</button>
      </div>

      {activeTab === "DETAILS" ? (
        <QuizEditorDetails quiz={quiz} setQuiz={setQuiz} />
      ) : (
        <QuizEditorQuestions questions={questions} setQuestions={setQuestions} />
      )}
    </div>
  );
}
