import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";
import "./styles.css";

export default function AssignmentViewer() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);

  console.log("Course ID:", cid);
  console.log("Assignment ID:", aid);
  console.log("Assignments:", assignments);

  if (!assignments || assignments.length === 0) {
    return <p className="text-muted">No assignments found. Please check your data source.</p>;
  }

  const assignment = assignments.find((a: any) => a._id === aid && a.course === cid);

  if (!assignment) {
    return <p className="text-muted">Assignment not found.</p>;
  }

  return (
    <div id="wd-assignments-editor">
      <h3>{assignment.title}</h3>
      <Card className="wd-rounded-container">
        <Card.Body>
          <p><strong>Description:</strong></p>
          <p>{assignment.description || "No description available."}</p>

          <p><strong>Points:</strong> {assignment.points || "N/A"}</p>
          <p><strong>Due Date:</strong> {assignment.dueDate || "TBD"}</p>
          <p><strong>Available From:</strong> {assignment.availableFrom || "TBD"}</p>
          <p><strong>Until:</strong> {assignment.availableUntil || "TBD"}</p>
        </Card.Body>
      </Card>

      <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}>
        Back to Assignments
      </Button>
    </div>
  );
}
