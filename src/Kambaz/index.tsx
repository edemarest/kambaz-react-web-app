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

// Updated Enrollment interface to use full user and course objects instead of just IDs
interface Enrollment {
  user: any; // Full user object
  course: any; // Full course object
  status: string; // Enrollment status (ENROLLED, DROPPED, UNENROLLED)
}

interface Course {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  number: string;
}

export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]); // Store full user and course objects
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.findAllCourses();
      setCourses(allCourses);
    } catch (err: any) {
      setError(`Failed to fetch courses: ${err.message || err}`);
    }
  };

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
        course: e.course,  // Keep the full course object
        user: e.user,  // Keep the full user object
      }));

      setEnrollments(normalized);
    } catch (err: any) {
      setError(`Failed to load enrollments: ${err.message || err}`);
    }
  };

  // Add a new course
  const addNewCourse = async (newCourse: any) => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) {
      return;
    }
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

  // Update an existing course
  const updateCourse = async (courseId: string, course: Course) => {
    if (!courseId) {
      setError("Course ID is required to update a course.");
      return;
    }
    try {
      await courseClient.updateCourse(courseId, course);
      setCourses(
        courses.map((c) =>
          c._id === courseId
            ? { ...c, name: course.name, description: course.description }
            : c
        )
      );
    } catch (err: any) {
      setError(`Failed to update course: ${err.message || err}`);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId: string) => {
    try {
      await courseClient.deleteCourse(courseId);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err: any) {
      setError(`Failed to delete course: ${err.message || err}`);
    }
  };

  // Handle enrollment and unenrollment
  const updateEnrollment = async (courseId: string, enroll: boolean) => {
    try {
      if (enroll) {
        await courseClient.enrollInCourse(courseId);
      } else {
        await courseClient.unenrollFromCourse(courseId);
      }
      await fetchEnrollments();  // Re-fetch the enrollments after updating
      await fetchCourses();  // Re-fetch the courses to reflect changes
    } catch (err: any) {
      setError(`Enrollment failed`);
    }
  };


  // Fetch data when the currentUser is set
  useEffect(() => {
    const fetchAll = async () => {
      if (currentUser?._id) {
        await fetchCourses();
        await fetchEnrollments();
      }
    };
    fetchAll();
  }, [currentUser]);

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
                    fetchCourses={fetchCourses}  // Pass fetchCourses here
                    fetchEnrollments={fetchEnrollments}  // Pass fetchEnrollments here
                    addNewCourse={addNewCourse}
                    updateCourse={updateCourse}
                    deleteCourse={deleteCourse}
                    setCourses={setCourses}
                    fetchAll={fetchAll}
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
