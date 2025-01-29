import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> 
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> 
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} className="g-4">
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

          {/* CS2345 Empirical Research Methods */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/2345/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS2345 Empirical Research Methods</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Research Techniques & Methodologies
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS6789 Software Engineering */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/6789/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS6789 Software Engineering</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Software Development Lifecycle
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS4321 Human Computer Interaction */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/4321/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS4321 Human Computer Interaction</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    User Experience & Design
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS8765 Object Oriented Programming */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/8765/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS8765 Object Oriented Programming</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    OOP Principles & Design
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          {/* CS3456 Computer Systems */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link to="/Kambaz/Courses/3456/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/dash.png" width="100%" height={160} />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title">CS3456 Computer Systems</Card.Title>
                  <Card.Text className="wd-dashboard-course-description">
                    Architecture & Low-Level Programming
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