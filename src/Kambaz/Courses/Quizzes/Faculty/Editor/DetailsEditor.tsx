import { useParams } from "react-router-dom";
import '../../index.css';

export default function QuizEditorDetails({ quiz, setQuiz }: {
  quiz: any;
  setQuiz: React.Dispatch<React.SetStateAction<any>>;
}) {
  useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value;
    setQuiz((prev: any) => ({ ...prev, [name]: newValue }));
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <>
      <input
        type="text"
        name="title"
        value={quiz.title || ""}
        onChange={handleChange}
        className="quiz-title"
        placeholder="Quiz Title"
      />

      <textarea
        name="description"
        value={quiz.description || ""}
        onChange={handleChange}
        className="quiz-description"
        placeholder="Quiz Instructions..."
      />

      <div className="quiz-options">
        <label>
          Quiz Type:
          <select name="quizType" value={quiz.quizType || "GRADED"} onChange={handleChange} className="form-select">
            <option value="GRADED">Graded Quiz</option>
            <option value="PRACTICE">Practice Quiz</option>
            <option value="GRADED_SURVEY">Graded Survey</option>
            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
          </select>
        </label>

        <label>
          Assignment Group:
          <select name="assignmentGroup" value={quiz.assignmentGroup || "Quizzes"} onChange={handleChange} className="form-select">
            <option value="Quizzes">Quizzes</option>
            <option value="Exams">Exams</option>
            <option value="Assignments">Assignments</option>
            <option value="Project">Project</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            name="shuffleAnswers"
            checked={quiz.shuffleAnswers || false}
            onChange={handleChange}
          />
          Shuffle Answers
        </label>

        <label>
          <input
            type="checkbox"
            name="hasTimeLimit"
            checked={quiz.hasTimeLimit || false}
            onChange={handleChange}
          />
          Time Limit
          <input
            type="number"
            name="timeLimit"
            disabled={!quiz.hasTimeLimit}
            value={quiz.timeLimit || ""}
            onChange={handleChange}
            className="ms-2"
          />
          minutes
        </label>

        <label>
          <input
            type="checkbox"
            name="multipleAttempts"
            checked={quiz.multipleAttempts || false}
            onChange={handleChange}
          />
          Allow Multiple Attempts
        </label>

        {quiz.multipleAttempts && (
          <label>
            Attempts Allowed:
            <input
              type="number"
              name="allowedAttempts"
              value={quiz.allowedAttempts || 1}
              onChange={handleChange}
              className="form-control"
            />
          </label>
        )}

        <label>
          Show Correct Answers:
          <select
            name="showCorrectAnswers"
            value={quiz.showCorrectAnswers ? "YES" : "NO"}
            onChange={(e) =>
              handleChange({
                ...e,
                target: {
                  ...e.target,
                  name: "showCorrectAnswers",
                  value: e.target.value === "YES",
                },
              } as any)
            }
            className="form-select"
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </label>

        <label>
          Access Code:
          <input
            type="checkbox"
            name="oneQuestionAtATime"
            checked={quiz.oneQuestionAtATime || false}
            onChange={handleChange}
          />
          One Question at a Time
        </label>

        <label>
          <input
            type="checkbox"
            name="webcamRequired"
            checked={quiz.webcamRequired || false}
            onChange={handleChange}
          />
          Webcam Required
        </label>

        <label>
          <input
            type="checkbox"
            name="lockQuestionsAfterAnswering"
            checked={quiz.lockQuestionsAfterAnswering || false}
            onChange={handleChange}
          />
          Lock Questions After Answering
        </label>
      </div>

      <div className="quiz-assign">
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={quiz.dueDate?.split("T")[0] || ""}
          onChange={handleChange}
        />
        <label>Available From:</label>
        <input
          type="date"
          name="availableFrom"
          value={quiz.availableFrom?.split("T")[0] || ""}
          onChange={handleChange}
        />
        <label>Until:</label>
        <input
          type="date"
          name="availableUntil"
          value={quiz.availableUntil?.split("T")[0] || ""}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
