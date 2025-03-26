import { useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as enrollmentsClient from "./Enrollments/client";
import "./styles.css";

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

export default function Dashboard({
  courses,
  setCourses,
  enrollments,
  setEnrollments,
}: {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  enrollments: Enrollment[];
  setEnrollments: (e: Enrollment[]) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const isFaculty = currentUser?.role === "FACULTY";
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Course>({
    _id: crypto.randomUUID(),
    name: "",
    description: "",
    createdBy: currentUser._id,
  });

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollmentsClient.enrollInCourse(courseId);
      const newEnrollments = await enrollmentsClient.getUserEnrollments();
      setEnrollments(newEnrollments);
    } catch (err) {
      setErrorMessage("Failed to enroll in the course. Please try again.");
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await enrollmentsClient.unenrollFromCourse(courseId);
      const newEnrollments = await enrollmentsClient.getUserEnrollments();
      setEnrollments(newEnrollments);
    } catch (err) {
      setErrorMessage("Failed to unenroll from the course. Please try again.");
    }
  };

  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.course === course._id)
  );

  const facultyCreatedCourses = courses.filter((course) => course.createdBy === currentUser._id);

  const handleAddCourse = () => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) return;
    const courseToAdd = { ...newCourse, _id: crypto.randomUUID(), createdBy: currentUser._id };
    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    setNewCourse({ _id: crypto.randomUUID(), name: "", description: "", createdBy: currentUser._id });
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;
    setCourses(
      courses.map((course) =>
        course._id === editingCourse._id
          ? { ...course, name: editingCourse.name, description: editingCourse.description }
          : course
      )
    );
    setEditingCourse(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  };

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
          <Button variant="primary" onClick={handleAddCourse}>Add Course</Button>
          <Button variant="primary" onClick={() => setShowAllCourses(!showAllCourses)}>
            {showAllCourses ? "Show My Created Courses" : "Show All Courses"}
          </Button>
        </div>
      )}

      {!isFaculty && (
        <Button variant="primary" className="mb-3" onClick={() => setShowAllCourses(!showAllCourses)}>
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
              value={editingCourse ? editingCourse.description : newCourse.description}
              className="form-control"
              placeholder="Course Description"
              onChange={(e) =>
                editingCourse
                  ? setEditingCourse({ ...editingCourse, description: e.target.value })
                  : setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
            {editingCourse && (
              <Button variant="warning" className="mt-2" onClick={handleUpdateCourse}>
                Update Course
              </Button>
            )}
          </div>
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({(showAllCourses ? courses : isFaculty ? facultyCreatedCourses : enrolledCourses).length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {(showAllCourses ? courses : isFaculty ? facultyCreatedCourses : enrolledCourses).map((course) => {
            const isEnrolled = enrollments.some((en) => en.course === course._id);

            return (
              <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card className="h-100 d-flex flex-column">
                  <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    <Card.Title><strong>{course.name}</strong></Card.Title>
                    <Card.Text>{course.description}</Card.Text>
                    <div className="flex-grow-1"></div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/Kambaz/Courses/${course._id}/Home`)}
                        disabled={!isFaculty && !isEnrolled}
                      >
                        Go
                      </Button>

                      {!isFaculty && (
                        isEnrolled ? (
                          <Button variant="danger" onClick={() => handleUnenroll(course._id)}>Unenroll</Button>
                        ) : (
                          <Button variant="success" onClick={() => handleEnroll(course._id)}>Enroll</Button>
                        )
                      )}

                      {isFaculty && (
                        <>
                          <Button variant="warning" onClick={() => setEditingCourse(course)}>Edit</Button>
                          <Button variant="danger" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
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
