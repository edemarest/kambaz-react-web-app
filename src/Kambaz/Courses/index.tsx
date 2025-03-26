import { Route, Routes, useParams, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import AssignmentViewer from "./Assignments/AssignmentView";
import PeopleTable from "./People/Table";

interface Course {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
}

interface Enrollment {
  user: string;
  course: string;
}

export default function Courses({
  courses,
  enrollments,
}: {
  courses: Course[];
  enrollments: Enrollment[];
}) {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const course = courses.find((c) => c._id === cid);

  if (!course) return <p className="text-muted">Course not found.</p>;

  const isFaculty = currentUser?.role === "FACULTY";

  const isEnrolled = isFaculty || enrollments.some(
    (e) => e.user === currentUser?._id && e.course === cid
  );  

  if (!isEnrolled) return <Navigate to="/Kambaz/Dashboard" />;

  return (
    <div id="wd-courses" className="d-flex">
      <div className="wd-course-nav">
        <CourseNavigation />
      </div>
      <div className="flex-fill p-3">
        <h2 className="text-danger">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course.name}
        </h2>
        <hr />
        <Routes>
          <Route path="Home" element={<Home />} />
          <Route path="Modules" element={<Modules />} />
          <Route path="Assignments" element={<Assignments />} />
          {isFaculty && <Route path="Assignments/:aid" element={<AssignmentEditor />} />}
          {!isFaculty && <Route path="Assignments/View/:aid" element={<AssignmentViewer />} />}
          <Route path="People" element={<PeopleTable />} />
        </Routes>
      </div>
    </div>
  );
}
