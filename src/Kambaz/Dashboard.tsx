import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> 
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> 
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {/* CS1234 React JS */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS1234 React JS</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Full Stack Software Developer
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS5678 Web Development */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/5678/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS5678 Web Development</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Web Development
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS9101 Data Structures */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/9101/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS9101 Data Structures</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Algorithms & Data Structures
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

