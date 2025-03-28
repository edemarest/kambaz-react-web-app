import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";
import "./styles.css";

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

export default function Dashboard({
  courses,
  enrollments,
  updateEnrollment,
  fetchCourses,
  fetchEnrollments,
  addNewCourse,
  updateCourse,
  deleteCourse,
  setCourses,
  fetchAll
}: {
  courses: Course[];
  enrollments: Enrollment[];
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
  fetchCourses: () => void;
  fetchEnrollments: () => void;
  setCourses: (courses: Course[]) => void;
  addNewCourse: (newCourse: Course) => void;
  updateCourse: (courseId: string, course: Course) => void;
  deleteCourse: (id: string) => void;
  fetchAll: () => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const isFaculty = currentUser?.role === "FACULTY";

  const [showAllCourses, setShowAllCourses] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newCourse, setNewCourse] = useState<Course>({
    _id: "",
    name: "",
    description: "",
    createdBy: currentUser._id,
    number: ""
  });

  const facultyCreatedCourses = courses.filter(
    (course) => course.createdBy === currentUser._id
  );

  const handleAddCourse = async () => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) {
      return;
    }
    try {
      await addNewCourse(newCourse);
      await fetchAll();
      setNewCourse({
        _id: "",
        name: "",
        description: "",
        createdBy: currentUser._id,
        number: ""
      });
    } catch (err: any) {
      setErrorMessage("Failed to add course: " + err.message);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    try {
      await updateCourse(editingCourse._id, editingCourse);
      fetchAll();
      setEditingCourse(null);
    } catch (err: any) {
      setErrorMessage("Failed to update course: " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      fetchAll();
    } catch (err: any) {
      setErrorMessage("Failed to delete course: " + err.message);
    }
  };

  const handleEnrollment = async (courseId: string, enroll: boolean) => {
    try {
      await updateEnrollment(courseId, enroll);
      await fetchEnrollments();  // Ensure enrollments state is updated
      await fetchCourses();  // Re-fetch the courses to ensure they are updated
    } catch (err: any) {
      setErrorMessage(`Failed to ${enroll ? "enroll in" : "unenroll from"} course: ${err.message}`);
    }
  };

  const enrolledCourses = Array.isArray(enrollments)
    ? courses.filter((course) => {
      const isEnrolledInCourse = enrollments.some(
        (en) =>
          en.course._id === course._id &&
          en.user === currentUser._id &&
          en.status === "ENROLLED"
      );
      return isEnrolledInCourse;
    })
    : [];

  const droppedCourses = Array.isArray(enrollments)
    ? courses.filter((course) => {
      const enrollment = enrollments.find(
        (en) => en.course._id === course._id && en.user._id === currentUser._id
      );
      // Return courses with DROPPED status
      return enrollment && enrollment.status === "DROPPED";
    })
    : [];

  const unenrolledCourses = Array.isArray(enrollments)
    ? courses.filter((course) => {
      const enrollment = enrollments.find(
        (en) => en.course._id === course._id && en.user._id === currentUser._id
      );
      // Return courses with UNENROLLED status
      return !enrollment;
    })
    : [];


  const visibleCourses = showAllCourses
    ? courses
    : isFaculty
      ? facultyCreatedCourses
      : enrolledCourses;

  useEffect(() => { }, [enrollments]);

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
          {errorMessage}
        </Alert>
      )}

      {isFaculty && (
        <div className="d-flex justify-content-between mb-2">
          <Button variant="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            {showAllCourses ? "Show My Created Courses" : "Show All Courses"}
          </Button>
        </div>
      )}

      {!isFaculty && (
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
        </Button>
      )}

      {isFaculty && (
        <>
          <h5>{editingCourse ? "Editing Course Details" : "Adding a New Course"}</h5>
          <div className="mb-3">
            <input
              value={editingCourse ? editingCourse.name : newCourse.name}
              className="form-control mb-2"
              placeholder="Course Name"
              onChange={(e) =>
                editingCourse
                  ? setEditingCourse({ ...editingCourse, name: e.target.value })
                  : setNewCourse({ ...newCourse, name: e.target.value })
              }
            />
            <textarea
              value={
                editingCourse ? editingCourse.description : newCourse.description
              }
              className="form-control"
              placeholder="Course Description"
              onChange={(e) =>
                editingCourse
                  ? setEditingCourse({
                    ...editingCourse,
                    description: e.target.value,
                  })
                  : setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
            {editingCourse && (
              <Button
                variant="warning"
                className="mt-2"
                onClick={handleUpdateCourse}
              >
                Update Course
              </Button>
            )}
          </div>
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({visibleCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {visibleCourses.map((course) => {
            const isEnrolled = enrolledCourses.some((en) => en._id === course._id);
            const isDropped = droppedCourses.some((en) => en._id === course._id);
            const isUnenrolled = unenrolledCourses.some((en) => en._id === course._id);

            return (
              <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card className="h-100 d-flex flex-column">
                  <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    <Card.Title><strong>{course.name}</strong></Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    <div className="flex-grow-1" />
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (isEnrolled) {
                            navigate(`/Kambaz/Courses/${course._id}/Home`);
                          } else {
                            alert("You need to enroll in this course first!");
                          }
                        }}
                        disabled={!isFaculty && !isEnrolled}
                      >
                        Go
                      </Button>


                      {!isFaculty && (
                        <>
                          {isEnrolled ? (
                            <Button
                              variant="danger"
                              onClick={() => handleEnrollment(course._id, false)}
                            >
                              Unenroll
                            </Button>
                          ) : (
                            <Button
                              variant="success"
                              onClick={() => handleEnrollment(course._id, true)}
                            >
                              Enroll
                            </Button>
                          )}
                        </>
                      )}

                      {isFaculty && (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => setEditingCourse(course)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
