import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as db from "./Database";
import "./styles.css"

export default function Dashboard() {
  const courses = db.courses;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
          {courses.map((course) => (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card className="h-100 d-flex flex-column"> {/* Ensures uniform height */}
                <Link to={`/Kambaz/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark d-flex flex-column h-100">
                  <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    <Card.Title className="wd-dashboard-course-title">{course.name}</Card.Title>
                    <Card.Text className="wd-dashboard-course-description">
                      {course.description}
                    </Card.Text>
                    {/* Spacer to push button down */}
                    <div className="flex-grow-1"></div>
                    <Button variant="primary" className="wd-course-go-button">Go</Button>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
