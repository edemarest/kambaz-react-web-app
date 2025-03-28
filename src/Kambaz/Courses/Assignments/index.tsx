import {
  ListGroup,
  Button,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import { BsPlusLg, BsSearch, BsGripVertical } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as client from "./client";
import "./styles.css";

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

export default function Assignments() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(
    null,
  );

  const loadAssignments = async () => {
    try {
      const data = await client.fetchAssignmentsForCourse(cid!);
      setAssignments(data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  const handleDelete = async () => {
    if (selectedAssignment) {
      await client.deleteAssignment(selectedAssignment);
      setAssignments(assignments.filter((a) => a._id !== selectedAssignment));
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (cid) {
      loadAssignments();
    }
  }, [cid]);

  return (
    <div id="wd-assignments">
      <div className="wd-assignments-toolbar">
        <InputGroup className="wd-search-bar">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <FormControl placeholder="Search for Assignments" />
        </InputGroup>

        {isFaculty && (
          <div className="wd-toolbar-buttons">
            <Button className="wd-group-btn">
              <BsPlusLg className="me-2" /> Group
            </Button>
            <Link to={`/Kambaz/Courses/${cid}/Assignments/New`}>
              <Button className="wd-assignment-btn">
                <BsPlusLg className="me-2" /> Assignment
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="wd-assignments-header">
        <h5>
          <BsGripVertical className="me-2" />
          ASSIGNMENTS <span className="text-muted">40% of Total</span>
        </h5>
        {isFaculty && (
          <Link to={`/Kambaz/Courses/${cid}/Assignments/New`}>
            <Button className="wd-add-assignment">
              <BsPlusLg />
            </Button>
          </Link>
        )}
      </div>

      <ListGroup className="mt-3">
        {assignments.length > 0 ? (
          assignments.map(({ _id, title, dueDate, points }: Assignment) => (
            <ListGroup.Item key={_id} className="wd-assignment-list-item">
              <div className="wd-assignment-left">
                <BsGripVertical className="text-muted" />
                <FaCheckCircle className="text-success" />
                <div>
                  {isFaculty ? (
                    <Link
                      to={`/Kambaz/Courses/${cid}/Assignments/${_id}`}
                      className="wd-assignment-link"
                    >
                      {title}
                    </Link>
                  ) : (
                    <Link
                      to={`/Kambaz/Courses/${cid}/Assignments/View/${_id}`}
                      className="wd-assignment-link"
                    >
                      {title}
                    </Link>
                  )}
                  <div className="wd-assignment-details text-muted">
                    Due Date: {dueDate || "TBD"} | {points ?? 100} pts
                  </div>
                </div>
              </div>

              {isFaculty && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedAssignment(_id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </Button>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-muted">
            No assignments available for this course.
          </p>
        )}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
