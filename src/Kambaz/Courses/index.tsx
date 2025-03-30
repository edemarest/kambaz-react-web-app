import { useEffect, useState } from "react";
import { useParams, Navigate, Route, Routes } from "react-router-dom";
import * as client from "./client";
import PeopleTable from "./People/Table";
import Assignments from "./Assignments";
import Home from "./Home";
import Modules from "./Modules";
import CourseNavigation from "./Navigation";
import AssignmentEditor from "./Assignments/Editor";
import AssignmentView from "./Assignments/AssignmentView";
import Quiz from "./Quizzes";

interface Enrollment {
  user: any;
  course: any;
  status: string;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  number: string;
}

export default function Courses({
  courses,
  enrollments,
  currentUser,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  currentUser: any;
}) {
  const { cid } = useParams();
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);

  const course = courses.find((c) => c._id === cid);


  const fetchEnrolledUsers = async () => {
    try {
      const users = await client.findUsersForCourse(course?._id || "");
      const filtered = users.filter((u: any) => u && u._id);
      setEnrolledUsers(filtered);
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
    }
  };

  useEffect(() => {
    if (course?._id) {
      fetchEnrolledUsers();
    }
  }, [course]);

  const isEnrolled = enrollments.some((en) => {
    const courseId = en.course?._id || en.course;
    const userId = en.user?._id || en.user;
    return (
      courseId === course?._id &&
      userId === currentUser?._id &&
      en.status === "ENROLLED"
    );
  });

  if (!isEnrolled) {
    return <Navigate to="/Kambaz/Dashboard" />;
  }
  if (!courses.length) return <p>Loading courses...</p>;
  if (!course) return <p className="text-muted">Course not found.</p>;

  return (
    <div id="wd-courses" className="d-flex">
      <div className="wd-course-nav">
        <CourseNavigation />
      </div>
      <div className="flex-fill p-3">
        <h2 className="text-danger">{course.name}</h2>
        <hr />
        <Routes>
          <Route path="Home" element={<Home />} />
          <Route path="Modules" element={<Modules />} />
          <Route path="Assignments" element={<Assignments />} />
          <Route path="Assignments/New" element={<AssignmentEditor />} />
          <Route path="Assignments/View/:aid" element={<AssignmentView />} />
          <Route path="Assignments/:aid" element={<AssignmentEditor />} />
          <Route path="Quizzes/*" element={<Quiz currentUser={currentUser} />} />

          <Route
            path="People"
            element={
              <PeopleTable
                users={enrolledUsers}
                selectedUser={null}
                refreshUsers={fetchEnrolledUsers}
                linkToUserDetails={false}
                onSelectUser={() => setEnrolledUsers((prev) => [...prev])}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}
