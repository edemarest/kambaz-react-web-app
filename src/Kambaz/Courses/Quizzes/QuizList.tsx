import { Link, useParams, useLocation } from "react-router-dom";
import QuizOptions from "./QuizOptions";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from "react";

interface Quiz {
    _id: string;
    title: string;
    description: string;
    dueDate?: string;
    availableFrom?: string;
    availableUntil?: string;
    published: boolean;
    points?: number;
}

interface Question {
    _id: string;
    points: number;
}

export default function QuizList({
    quizzes,
    currentUser,
    questionsMap,
    refresh,
}: {
    quizzes: Quiz[];
    currentUser: any;
    questionsMap: { [key: string]: Question[] };
    refresh: () => void;
}) {
    const { cid } = useParams();
    const location = useLocation();
    const getAvailabilityLabel = (quiz: Quiz) => {
        const now = new Date();
        const from = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
        const until = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

        if (from && now < from) {
            return `Not available until ${from.toLocaleDateString()}`;
        } else if (until && now > until) {
            return "Closed";
        } else {
            return "Available";
        }
    };
    useEffect(() => {
        if (location.state?.refresh) {
            refresh();
        }
    }, [location.state]);     

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Course Quizzes</h4>
                {currentUser?.role === "FACULTY" && (
                    <Link
                        to={`/Kambaz/Courses/${cid}/Quizzes/new`}
                        className="btn btn-danger"
                    >
                        + Quiz
                    </Link>
                )}
            </div>
            <ul className="list-group">
                {quizzes
                    .filter((quiz) => currentUser?.role === "FACULTY" || quiz.published)
                    .map((quiz) => (
                        <li key={quiz._id} className="list-group-item quiz-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link
                                    to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                                    className="quiz-link flex-grow-1 text-decoration-none text-dark"
                                >
                                    <strong className="quiz-list-title">{quiz.title}</strong> — {quiz.description}
                                    <br />
                                    <small>
                                        {getAvailabilityLabel(quiz)} | Due: {quiz.dueDate?.split("T")[0]} | {quiz.points ?? 0} pts | {questionsMap[quiz._id]?.length ?? 0} Questions
                                    </small>
                                </Link>

                                {currentUser?.role === "FACULTY" && (
                                    <div className="d-flex align-items-center ms-3 gap-2">
                                        <span title={quiz.published ? "Published" : "Unpublished"}>
                                            {quiz.published ? "✅" : "🚫"}
                                        </span>
                                        <QuizOptions quiz={quiz} refresh={refresh} />
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
