import { useState } from "react";
import { useParams } from "react-router-dom";
import MCQEditor from "./MCQEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import "../../index.css";
import FillinTheBlankEditor from "./FillinTheBlankEditor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const questionTypes = [
  { label: "Multiple Choice", value: "MCQ" },
  { label: "True/False", value: "TRUE_FALSE" },
  { label: "Fill in the Blank", value: "FILL_BLANK" },
];

interface Question {
  _id?: string;
  quizId: string;
  title: string;
  questionText: string;
  type: string;
  points: number;
  choices?: string[];
  correctChoiceIndex?: number;
  acceptedAnswers?: string[];
}

export default function QuestionEditor({
  questions,
  setQuestions,
}: {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { qid } = useParams();
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

  const handleUpdate = (updated: Question) => {
    setTempQuestion(updated);
  };

  const handleTypeChange = (type: string) => {
    if (tempQuestion) {
      setTempQuestion({ ...tempQuestion, type });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      quizId: qid || "",
      title: "New Question",
      questionText: "",
      type: "MCQ",
      points: 1,
      choices: ["Option A", "Option B", "Option C"],
      correctChoiceIndex: 0,
    };
    setQuestions([...questions, newQuestion]);
    setEditIndex(questions.length);
    setTempQuestion(newQuestion);
  };

  const handleSave = () => {
    if (editIndex !== null && tempQuestion) {
      if (!tempQuestion.title.trim() || !tempQuestion.questionText.trim()) {
        setError("Title and question text cannot be empty.");
        return;
      }
      setError(null);
      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = tempQuestion;
      setQuestions(updatedQuestions);
      setEditIndex(null);
      setTempQuestion(null);
    }
  };

  const isSaveDisabled =
    !tempQuestion ||
    !tempQuestion.title ||
    !tempQuestion.questionText ||
    !tempQuestion.type ||
    tempQuestion.points <= 0;

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Quiz Questions</h5>
        <span>
          <strong>Points:</strong> {totalPoints}
        </span>
      </div>

      <button
        className="btn btn-outline-secondary mb-3"
        onClick={handleAddQuestion}
      >
        + New Question
      </button>

      {error && <p className="text-danger">{error}</p>}
      {!questions.length && <p className="text-muted">No questions yet.</p>}

      {questions.map((q, index) => (
        <div key={q._id || index} className="border p-3 mb-3 rounded">
          {editIndex === index ? (
            <>
              <input
                className="form-control mb-2"
                value={tempQuestion?.title || ""}
                onChange={(e) =>
                  handleUpdate({ ...tempQuestion!, title: e.target.value })
                }
              />
              <ReactQuill
                className="mb-4"
                theme="snow"
                value={tempQuestion?.questionText || ""}
                onChange={(value) =>
                  handleUpdate({ ...tempQuestion!, questionText: value })
                }
              />
              <label>Type:</label>
              <select
                className="form-select mb-3"
                value={tempQuestion?.type || ""}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                {questionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <label>Points:</label>
              <input
                type="number"
                className="form-control mb-2"
                value={tempQuestion?.points || 0}
                onChange={(e) =>
                  handleUpdate({
                    ...tempQuestion!,
                    points: Number(e.target.value),
                  })
                }
              />

              {tempQuestion?.type === "MCQ" && (
                <MCQEditor question={tempQuestion} onChange={handleUpdate} />
              )}
              {tempQuestion?.type === "TRUE_FALSE" && (
                <TrueFalseEditor
                  question={tempQuestion}
                  onChange={handleUpdate}
                />
              )}
              {tempQuestion?.type === "FILL_BLANK" && (
                <FillinTheBlankEditor
                  question={tempQuestion}
                  onChange={handleUpdate}
                />
              )}
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <h6>
                Q{index + 1}. {q.title}
              </h6>
              <p>{q.questionText}</p>
              <small>
                Type: {q.type} | {q.points} pts
              </small>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setEditIndex(index);
                    setTempQuestion(q);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={async () => {
                    if (!q._id) return;
                    if (
                      window.confirm(
                        "Are you sure you want to delete this question?",
                      )
                    ) {
                      setQuestions(questions.filter((_, i) => i !== index));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
