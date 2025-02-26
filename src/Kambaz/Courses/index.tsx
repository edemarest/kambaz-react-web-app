import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import AssignmentViewer from "./Assignments/AssignmentView";
import { FaAlignJustify } from "react-icons/fa6";
import { Route, Routes, useParams, Navigate } from "react-router";
import PeopleTable from "./People/Table";
import { useSelector } from "react-redux";

interface Enrollment {
  user: string;
  course: string;
}

export default function Courses({ courses }: { courses: any[] }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments }: { enrollments: Enrollment[] } = useSelector((state: any) => state.enrollmentsReducer);

  if (!course) return <p className="text-muted">Course not found.</p>;

  const isEnrolled = enrollments.some((enrollment: Enrollment) => enrollment.user === currentUser?._id && enrollment.course === cid);

  if (!isEnrolled && currentUser?.role !== "FACULTY") return <Navigate to="/Kambaz/Dashboard" />;

  return (
    <div id="wd-courses" className="d-flex">
      <div className="wd-course-nav">
        <CourseNavigation />
      </div>
      <div className="flex-fill p-3">
        <h2 className="text-danger">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course?.name}
        </h2>
        <hr />
        <Routes>
          <Route path="Home" element={<Home />} />
          <Route path="Modules" element={<Modules />} />
          <Route path="Assignments" element={<Assignments />} />
          
          {/* Faculty Route for Editing Assignments */}
          {currentUser?.role === "FACULTY" && (
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
          )}

          {/* Student Route for Viewing Assignments */}
          {currentUser?.role !== "FACULTY" && (
            <Route path="Assignments/View/:aid" element={<AssignmentViewer />} />
          )}

          <Route path="People" element={<PeopleTable />} />
        </Routes>
      </div>
    </div>
  );
}
