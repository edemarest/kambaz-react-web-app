import { Form, Button, Table, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { assignments } from "../../Database"
import "./styles.css";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const assignment = assignments.find((a) => a._id === aid && a.course === cid);

  if (!assignment) {
    return <p className="text-muted">Assignment not found.</p>;
  }

  return (
    <div id="wd-assignments-editor">
      <Form.Group controlId="wd-name">
        <Form.Label>Assignment Name</Form.Label>
        <Form.Control type="text" defaultValue={assignment.title} />
      </Form.Group>

      <Form.Group controlId="wd-description">
        <Form.Control
          as="textarea"
          rows={5}
          defaultValue={`The assignment is available online. Submit a link to the landing page of your Web application running on Netlify.\n
The landing page should include the following:\n• Your full name and section\n• Links to each of the lab assignments\n• Link to the Kanbas application\n• Links to all relevant source code repositories\n
The Kanbas application should include a link to navigate back to the landing page.`}
        />
      </Form.Group>

      <Table borderless>
        <tbody>
          {[
            { label: "Points", type: "number", defaultValue: "100" },
            { label: "Assignment Group", type: "select", options: ["ASSIGNMENTS"], defaultValue: "ASSIGNMENTS" },
            { label: "Display Grade as", type: "select", options: ["Percentage"], defaultValue: "Percentage" }
          ].map(({ label, type, defaultValue, options }, index) => (
            <tr key={index}>
              <td className="wd-label">
                <Form.Label>{label}</Form.Label>
              </td>
              <td>
                {options ? (
                  <Form.Select defaultValue={defaultValue}>
                    {options.map((option, i) => <option key={i}>{option}</option>)}
                  </Form.Select>
                ) : (
                  <Form.Control type={type} defaultValue={defaultValue} />
                )}
              </td>
            </tr>
          ))}

          <tr>
            <td className="wd-label">
              <Form.Label>Submission Type</Form.Label>
            </td>
            <td>
              <Card className="wd-rounded-container">
                <Form.Select defaultValue="Online" className="mb-2">
                  <option>Online</option>
                </Form.Select>
                <Form.Label className="wd-subtitle">Online Entry Options</Form.Label>
                <div className="wd-checkbox-group">
                  {["Text Entry", "Website URL", "Media Recordings", "Student Annotation", "File Uploads"].map((label, i) => (
                    <Form.Check
                      type="checkbox"
                      key={i}
                      label={label}
                      defaultChecked={label === "Website URL"}
                      className="form-check"
                    />
                  ))}
                </div>
              </Card>
            </td>
          </tr>

          <tr>
            <td className="wd-label">
              <Form.Label>Assign</Form.Label>
            </td>
            <td>
              <Card className="wd-rounded-container">
                <Form.Label className="wd-subtitle">Assign to</Form.Label>
                <Form.Control type="text" defaultValue="Everyone" />
                <Form.Label className="wd-subtitle">Due</Form.Label>
                <Form.Control type="date" defaultValue="2024-05-13" />
                <div className="d-flex wd-date-container">
                  {[
                    { label: "Available From", defaultValue: "2024-05-06" },
                    { label: "Until", defaultValue: "2024-05-20" }
                  ].map(({ label, defaultValue }, i) => (
                    <div key={i} className="wd-date-input">
                      <Form.Label className="wd-subtitle">{label}</Form.Label>
                      <Form.Control type="date" defaultValue={defaultValue} />
                    </div>
                  ))}
                </div>
              </Card>
            </td>
          </tr>
        </tbody>
      </Table>

      <hr />

      <div className="wd-editor-actions">
        <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
          <Button variant="light">Cancel</Button>
        </Link>
        <Link to={`/Kambaz/Courses/${cid}/Assignments`}>
          <Button variant="danger">Save</Button>
        </Link>
      </div>
    </div>
  );
}
