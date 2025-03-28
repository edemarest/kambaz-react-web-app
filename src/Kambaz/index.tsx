import { Routes, Route, Navigate } from "react-router-dom";
import KambazNavigation from "./AccNavigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import Account from "./Account";
import { useEffect, useState } from "react";
import "./styles.css";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import * as courseClient from "./Courses/client";
import * as enrollmentsClient from "./Enrollments/client";
import { useSelector } from "react-redux";

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
  enrolled?: boolean;
}

export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentsClient.getUserEnrollments();
      const arrayData = Array.isArray(data)
        ? data
        : Array.isArray(data.enrollments)
          ? data.enrollments
          : [];

      const normalized = arrayData.map((e: any) => ({
        ...e,
        course: e.course,
        user: e.user,
      }));

      setEnrollments(normalized);
    } catch (err: any) {
      setError(`Failed to load enrollments: ${err.message || err}`);
    }
  };

  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.findAllCourses();
      const enrolled = await enrollmentsClient.getUserEnrollments();
      const enrolledIds = enrolled.map((e: any) => e.course?._id);

      const updated = allCourses.map((course: Course) => ({
        ...course,
        enrolled: enrolledIds.includes(course._id),
      }));

      setCourses(updated);
    } catch (err: any) {
      setError(`Failed to fetch courses: ${err.message || err}`);
    }
  };

  const findCoursesForUser = async () => {
    try {
      const userEnrollments = await enrollmentsClient.getUserEnrollments();
      const justCourses = userEnrollments.map((e: any) => ({
        ...e.course,
        enrolled: true,
      }));
      setCourses(justCourses);
    } catch (err: any) {
      setError(`Failed to fetch user courses`);
    }
  };

  const updateEnrollment = async (courseId: string, enroll: boolean) => {
    try {
      if (enroll) {
        await courseClient.enrollInCourse(courseId);
      } else {
        await courseClient.unenrollFromCourse(courseId);
      }
      await fetchCourses();
      await fetchEnrollments();
    } catch {
      setError(`Enrollment failed`);
    }
  };

  useEffect(() => {
    if (currentUser?._id) {
      if (enrolling) {
        fetchCourses();
      } else {
        findCoursesForUser();
      }
      fetchEnrollments();
    }
  }, [currentUser, enrolling]);

  const addNewCourse = async (newCourse: Course) => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) return;
    try {
      const fullCourse = {
        ...newCourse,
        _id: crypto.randomUUID(),
        createdBy: currentUser._id,
      };
      const created = await courseClient.createCourse(fullCourse);
      setCourses([...courses, created]);
    } catch (err: any) {
      setError(`Failed to create course: ${err.message || err}`);
    }
  };

  const updateCourse = async (courseId: string, course: Course) => {
    try {
      await courseClient.updateCourse(courseId, course);
      setCourses(
        courses.map((c) =>
          c._id === courseId
            ? { ...c, name: course.name, description: course.description }
            : c,
        ),
      );
    } catch (err: any) {
      setError(`Failed to update course: ${err.message || err}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err: any) {
      setError(`Failed to delete course: ${err.message || err}`);
    }
  };

  const fetchAll = async () => {
    await fetchCourses();
    await fetchEnrollments();
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="Dashboard" />} />
            <Route path="Account/*" element={<Account />} />
            <Route
              path="Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    courses={courses}
                    enrollments={enrollments}
                    updateEnrollment={updateEnrollment}
                    fetchEnrollments={fetchEnrollments}
                    addNewCourse={addNewCourse}
                    updateCourse={updateCourse}
                    deleteCourse={deleteCourse}
                    fetchAll={fetchAll}
                    enrolling={enrolling}
                    setEnrolling={setEnrolling}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses
                    courses={courses}
                    enrollments={enrollments}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="Calendar" element={<h1>Calendar</h1>} />
            <Route path="Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
