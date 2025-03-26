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

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await enrollmentsClient.getUserEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      setError(`Failed to load enrollments: ${err.message || err}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await courseClient.findAllCourses();
        setCourses(courseData);
        await fetchEnrollments();
      } catch (err: any) {
        setError(`Failed to load courses or enrollments: ${err.message || err}`);
      }
    };
    fetchData();
  }, []);

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
                    setCourses={setCourses}
                    enrollments={enrollments}
                    setEnrollments={setEnrollments}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses courses={courses} enrollments={enrollments} />
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
