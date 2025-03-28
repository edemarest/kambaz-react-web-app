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

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const loadAssignments = async () => {
    const data = await client.fetchAssignmentsForCourse(cid!);
    setAssignments(data);

    const found = data.find((a: { _id: string | undefined }) => a._id === aid);
    if (found) {
      setAssignment(found);
    } else {
      setAssignment({
        _id: "",
        title: "",
        description: "Please describe the assignment...",
        points: 100,
        dueDate: "2024-05-13",
        availableFrom: "2024-05-06",
        availableUntil: "2024-05-20",
        course: cid!,
      });
    }
  };

  const handleSave = async () => {
    if (!assignment) return;

    if (assignment._id && assignments.find((a) => a._id === assignment._id)) {
      await client.updateAssignment(assignment._id, assignment);
    } else {
      await client.createAssignment(cid!, assignment);
    }

    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  useEffect(() => {
    if (cid) {
      loadAssignments();
    }
  }, [cid, aid]);

  if (!assignment) return null;

  return (
    <div id="wd-assignments-editor">
      <Form.Group controlId="wd-name">
        <Form.Label>Assignment Name</Form.Label>
        <Form.Control
          type="text"
          value={assignment.title}
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        />
      </Form.Group>

      <Form.Group controlId="wd-description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={assignment.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
        />
      </Form.Group>

      <Table borderless>
        <tbody>
          <tr>
            <td className="wd-label">
              <Form.Label>Points</Form.Label>
            </td>
            <td>
              <Form.Control
                type="number"
                value={assignment.points}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    points: parseInt(e.target.value),
                  })
                }
              />
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
                  onChange={(e) =>
                    setAssignment({ ...assignment, dueDate: e.target.value })
                  }
                />
                <div className="d-flex wd-date-container">
                  <div className="wd-date-input">
                    <Form.Label className="wd-subtitle">
                      Available From
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableFrom}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          availableFrom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="wd-date-input">
                    <Form.Label className="wd-subtitle">Until</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableUntil}
                      onChange={(e) =>
                        setAssignment({
                          ...assignment,
                          availableUntil: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </Card>
            </td>
          </tr>
        </tbody>
      </Table>

      <hr />

      <div className="wd-editor-actions">
        <Button
          variant="light"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
