import { useNavigate, useParams } from "react-router-dom";
import * as client from "./client";

export default function QuizOptions({ quiz, refresh }: { quiz: any; refresh: () => void }) {
  const { cid } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Delete this quiz?")) {
      await client.deleteQuiz(quiz._id);
      refresh();
    }
  };

  const handleTogglePublish = async () => {
    await client.updateQuiz(quiz._id, { ...quiz, published: !quiz.published });
    refresh();
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-light border dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        ⋮
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button
            className="dropdown-item"
            onClick={() =>
              navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Edit/Details`)
            }
          >
            Edit
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleDelete}>
            Delete
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={handleTogglePublish}>
            {quiz.published ? "Unpublish" : "Publish"}
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() =>
              navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Preview`)
            }
          >
            Preview
          </button>
        </li>
      </ul>
    </div>
  );
}
