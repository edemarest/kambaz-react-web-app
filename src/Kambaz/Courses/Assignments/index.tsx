import { ListGroup, Button, InputGroup, FormControl, Modal } from "react-bootstrap";
import { BsPlusLg, BsSearch, BsGripVertical } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteAssignment } from "./assignmentsReducer";
import { useState } from "react";
import "./styles.css";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);

  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const handleDelete = () => {
    if (selectedAssignment) {
      dispatch(deleteAssignment(selectedAssignment));
    }
    setShowModal(false);
  };

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
        {courseAssignments.length > 0 ? (
          courseAssignments.map(({ _id, title }: any) => (
            <ListGroup.Item key={_id} className="wd-assignment-list-item">
              <div className="wd-assignment-left">
                <BsGripVertical className="text-muted" />
                <FaCheckCircle className="text-success" />
                <div>
                  {isFaculty ? (
                    <Link to={`/Kambaz/Courses/${cid}/Assignments/${_id}`} className="wd-assignment-link">
                      {title}
                    </Link>
                  ) : (
                    <Link to={`/Kambaz/Courses/${cid}/Assignments/View/${_id}`} className="wd-assignment-link">
                      {title}
                    </Link>
                  )}
                  <div className="wd-assignment-details text-muted">
                    Due Date: TBD | 100 pts
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
          <p className="text-muted">No assignments available for this course.</p>
        )}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this assignment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
