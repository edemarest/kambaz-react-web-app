import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as client from "./client";
import '../index.css';

interface Question {
  _id: string;
  title: string;
  type: "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
  points: number;
  questionText: string;
}

export default function QuizQuestions() {
  const { qid } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      if (!qid) {
        setError("Missing quiz ID");
        return;
      }
      const data = await client.findQuestionsForQuiz(qid);
      setQuestions(data);
    } catch (err) {
      setError("Failed to load questions.");
    }
  };

  useEffect(() => {
    if (qid) fetchQuestions();
  }, [qid]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!questions.length) return <p>No questions yet. Click "New Question" to add one.</p>;

  return (
    <div>
      <h4>Questions for Quiz: {qid}</h4>
      <button className="btn btn-primary mb-3">+ New Question</button>
      <ul className="list-group">
        {questions.map((q) => (
          <li key={q._id} className="list-group-item">
            <strong>{q.title}</strong> ({q.points} pts)
            <br />
            Type: {q.type} <br />
            {q.questionText}
          </li>
        ))}
      </ul>
    </div>
  );
}
