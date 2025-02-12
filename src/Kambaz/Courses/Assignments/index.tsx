import { ListGroup, Button, InputGroup, FormControl } from "react-bootstrap";
import { BsPlusLg, BsSearch, BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { assignments } from "../../Database";

export default function Assignments() {
  const { cid } = useParams();
  const courseAssignments = assignments.filter((assignment) => assignment.course === cid);
  return (
    <div id="wd-assignments">
      <div className="wd-assignments-toolbar">
        <InputGroup className="wd-search-bar">
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <FormControl placeholder="Search for Assignments" />
        </InputGroup>

        <div className="wd-toolbar-buttons">
          <Button className="wd-group-btn">
            <BsPlusLg className="me-2" /> Group
          </Button>
          <Button className="wd-assignment-btn">
            <BsPlusLg className="me-2" /> Assignment
          </Button>
        </div>
      </div>

      <div className="wd-assignments-header">
        <h5>
          <BsGripVertical className="me-2" />
          ASSIGNMENTS <span className="text-muted">40% of Total</span>
        </h5>
        <Button className="wd-add-assignment">
          <BsPlusLg />
        </Button>
      </div>

      <ListGroup className="mt-3">
        {courseAssignments.length > 0 ? (
          courseAssignments.map(({ _id, title }) => (
            <ListGroup.Item key={_id} className="wd-assignment-list-item">
              <div className="wd-assignment-left">
                <BsGripVertical className="text-muted" />
                <FaCheckCircle className="text-success" />
                <div>
                  <Link to={`/Kambaz/Courses/${cid}/Assignments/${_id}`} className="wd-assignment-link">
                    {title}
                  </Link>
                  <div className="wd-assignment-details text-muted">
                    Due Date: TBD | 100 pts
                  </div>
                </div>
              </div>
              <IoEllipsisVertical className="wd-ellipsis-icon" />
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-muted">No assignments available for this course.</p>
        )}
      </ListGroup>
    </div>
  );
}
