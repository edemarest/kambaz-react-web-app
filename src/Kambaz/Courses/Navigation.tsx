import { Link, useParams } from "react-router-dom";
export default function CourseNavigation() {
  const { cid } = useParams();

  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label, index) => (
        <Link
          key={index}
          to={`/Kambaz/Courses/${cid}/${label}`}
          id={`wd-course-${label.toLowerCase()}-link`}
          className={`list-group-item border border-0 ${
            label === "Home" ? "active" : "text-danger"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}