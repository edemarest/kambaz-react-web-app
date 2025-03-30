import { useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./styles.css";

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

export default function Dashboard({
  courses,
  updateEnrollment,
  addNewCourse,
  updateCourse,
  deleteCourse,
  fetchAll,
  enrolling,
  setEnrolling,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
  fetchEnrollments: () => void;
  addNewCourse: (newCourse: Course) => void;
  updateCourse: (courseId: string, course: Course) => void;
  deleteCourse: (id: string) => void;
  fetchAll: () => void;
  enrolling: boolean;
  setEnrolling: (enrolling: boolean) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const isFaculty = currentUser?.role === "FACULTY";

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newCourse, setNewCourse] = useState<Course>({
    _id: "",
    name: "",
    description: "",
    createdBy: currentUser._id,
    number: "",
  });

  const visibleCourses = enrolling
    ? courses
    : isFaculty
      ? courses.filter(
          (course) => course.enrolled || course.createdBy === currentUser._id,
        )
      : courses.filter((course) => course.enrolled);

  const handleAddCourse = async () => {
    if (!newCourse.name.trim() || !newCourse.description.trim()) return;
    try {
      await addNewCourse(newCourse);
      await fetchAll();
      setNewCourse({
        _id: "",
        name: "",
        description: "",
        createdBy: currentUser._id,
        number: "",
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

  const [showValidationErrors, setShowValidationErrors] =
    useState<boolean>(false);
  const [showCourseForm, setShowCourseForm] = useState<boolean>(false);
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <div
          className="form-check form-switch float-end"
          style={{ transform: "scale(0.85)", transformOrigin: "top right" }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            id="enrollToggle"
            checked={enrolling}
            onChange={() => setEnrolling(!enrolling)}
            style={
              isFaculty
                ? { backgroundColor: "#d3d3d3" }
                : {
                    backgroundColor: enrolling ? "green" : "red",
                    borderColor: enrolling ? "green" : "red",
                    cursor: "pointer",
                  }
            }
          />
          <label
            className="form-check-label ms-1"
            htmlFor="enrollToggle"
            style={{
              fontWeight: "600",
              fontSize: "1.4rem",
              color: isFaculty ? "#000" : enrolling ? "green" : "red",
            }}
          >
            {isFaculty ? "Show All Courses" : "Enrolling"}
          </label>
        </div>
      </h1>
      <hr />
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          dismissible
        >
          {errorMessage}
        </Alert>
      )}
      {isFaculty && (
        <>
          <div className="d-flex justify-content-between mb-2">
            <Button
              variant={showCourseForm ? "success" : "primary"}
              onClick={() => {
                if (showCourseForm) {
                  if (!newCourse.name.trim() || !newCourse.description.trim()) {
                    setShowValidationErrors(true);
                    setTimeout(() => setShowValidationErrors(false), 3000);
                    return;
                  }
                  handleAddCourse();
                  setShowCourseForm(false);
                } else {
                  setShowCourseForm(true);
                }
              }}
            >
              {showCourseForm ? "Create" : "Add Course"}
            </Button>
          </div>

          {showCourseForm && (
            <>
              <h5 className="mt-3">Adding a New Course</h5>
              <div className="mb-3">
                <input
                  value={newCourse.name}
                  className="form-control mb-2"
                  placeholder="Course Name"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />
                {showValidationErrors && !newCourse.name.trim() && (
                  <small className="text-danger">
                    Course name is required.
                  </small>
                )}
                <textarea
                  value={newCourse.description}
                  className="form-control"
                  placeholder="Course Description"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
                {showValidationErrors && !newCourse.description.trim() && (
                  <small className="text-danger">
                    Course description is required.
                  </small>
                )}
              </div>
            </>
          )}
        </>
      )}
      {editingCourse && (
        <>
          <h5 className="mt-3">Editing Course</h5>
          <div className="mb-3">
            <input
              value={editingCourse.name}
              className="form-control mb-2"
              placeholder="Course Name"
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, name: e.target.value })
              }
            />
            {showValidationErrors && !editingCourse.name.trim() && (
              <small className="text-danger">Course name is required.</small>
            )}
            <textarea
              value={editingCourse.description}
              className="form-control"
              placeholder="Course Description"
              onChange={(e) =>
                setEditingCourse({
                  ...editingCourse,
                  description: e.target.value,
                })
              }
            />
            {showValidationErrors && !editingCourse.description.trim() && (
              <small className="text-danger">
                Course description is required.
              </small>
            )}
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="warning"
                onClick={() => {
                  if (
                    !editingCourse.name.trim() ||
                    !editingCourse.description.trim()
                  ) {
                    setShowValidationErrors(true);
                    setTimeout(() => setShowValidationErrors(false), 3000);
                    return;
                  }
                  handleUpdateCourse();
                }}
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditingCourse(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({visibleCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {visibleCourses.map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card className="h-100 d-flex flex-column">
                <Card.Img
                  variant="top"
                  src="/images/dash.png"
                  width="100%"
                  height={160}
                />
                <Card.Body className="d-flex flex-column flex-grow-1">
                  <Card.Title>
                    <strong>{course.name}</strong>
                  </Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <div className="flex-grow-1" />
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (
                          course.enrolled ||
                          course.createdBy === currentUser._id
                        ) {
                          navigate(`/Kambaz/Courses/${course._id}/Home`);
                        } else {
                          alert("You need to enroll in this course first!");
                        }
                      }}
                      disabled={
                        !(
                          course.enrolled ||
                          course.createdBy === currentUser._id
                        )
                      }
                    >
                      Go
                    </Button>

                    {enrolling && !isFaculty && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          updateEnrollment(course._id, !course.enrolled);
                        }}
                        className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} float-end`}
                      >
                        {course.enrolled ? "Unenroll" : "Enroll"}
                      </button>
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
                  {isFaculty && (
                    <Button
                      className="mt-3 w-100"
                      variant={course.enrolled ? "danger" : "success"}
                      onClick={(e) => {
                        e.preventDefault();
                        updateEnrollment(course._id, !course.enrolled);
                      }}
                    >
                      {course.enrolled
                        ? "Remove from My Courses"
                        : "Add to My Courses"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div
  style={{
    position: "fixed",
    bottom: "12px",
    right: "12px",
    fontSize: "0.75rem",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
    maxWidth: "220px",
    lineHeight: "1.3",
  }}
>
  <div>Quizzes Project by Ella Demarest</div>
  <div>Web Dev Section CS4550.37031.202530</div>
  <div>
    <a
      href="https://github.com/edemarest/kambaz-react-web-app/tree/project"
      target="_blank"
      rel="noreferrer"
    >
      Frontend Repository
    </a>
  </div>
  <div>
    <a
      href="https://github.com/edemarest/kambaz-node-server-app/tree/project"
      target="_blank"
      rel="noreferrer"
    >
      Backend Repository
    </a>
  </div>
</div>

      </div>
    </div>
  );
}
