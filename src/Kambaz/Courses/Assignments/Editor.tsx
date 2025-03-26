import { Form, Button, Table, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as client from "./client";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  course: string;
}

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  const loadAssignments = async () => {
    const data = await client.fetchAssignmentsForCourse(cid!);
    setAssignments(data);

    const found: Assignment | undefined = data.find((a: Assignment) => a._id === aid);
    if (found) {
      setAssignment(found);
    } else {
      setAssignment({
        _id: `A${Math.floor(Math.random() * 1000)}`,
        title: "",
        description: `The assignment is available online. Submit a link to the landing page of your Web application running on Netlify.\n
The landing page should include the following:\n• Your full name and section\n• Links to each of the lab assignments\n• Link to the Kanbas application\n• Links to all relevant source code repositories\n
The Kanbas application should include a link to navigate back to the landing page.`,
        points: 100,
        dueDate: "2024-05-13",
        availableFrom: "2024-05-06",
        availableUntil: "2024-05-20",
        course: cid,
      });
    }
  };

  const handleSave = async () => {
    if (!assignment) return;

    if (assignments.find((a) => a._id === aid)) {
      await client.updateAssignment(assignment._id, assignment);
    } else {
      await client.createAssignment(cid!, assignment);
    }
    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  useEffect(() => {
    loadAssignments();
  }, [cid, aid]);

  if (!assignment) return null;

  return (
    <div id="wd-assignments-editor">
      <Form.Group controlId="wd-name">
        <Form.Label>Assignment Name</Form.Label>
        <Form.Control
          type="text"
          value={assignment.title}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
        />
      </Form.Group>

      <Form.Group controlId="wd-description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={assignment.description}
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
        />
      </Form.Group>

      <Table borderless>
        <tbody>
          {[
            { label: "Points", type: "number", value: assignment.points, key: "points" },
            { label: "Assignment Group", type: "select", options: ["ASSIGNMENTS"], value: "ASSIGNMENTS", key: "group" },
            { label: "Display Grade as", type: "select", options: ["Percentage"], value: "Percentage", key: "grading" }
          ].map(({ label, type, value, key, options }, index) => (
            <tr key={index}>
              <td className="wd-label">
                <Form.Label>{label}</Form.Label>
              </td>
              <td>
                {options ? (
                  <Form.Select defaultValue={value}>
                    {options.map((option, i) => <option key={i}>{option}</option>)}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={type}
                    value={value}
                    onChange={(e) => setAssignment({ ...assignment, [key]: e.target.value })}
                  />
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
                <Form.Control
                  type="date"
                  value={assignment.dueDate}
                  onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                />
                <div className="d-flex wd-date-container">
                  {[
                    { label: "Available From", key: "availableFrom", value: assignment.availableFrom },
                    { label: "Until", key: "availableUntil", value: assignment.availableUntil }
                  ].map(({ label, key, value }, i) => (
                    <div key={i} className="wd-date-input">
                      <Form.Label className="wd-subtitle">{label}</Form.Label>
                      <Form.Control
                        type="date"
                        value={value}
                        onChange={(e) => setAssignment({ ...assignment, [key]: e.target.value })}
                      />
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
        <Button variant="light" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
