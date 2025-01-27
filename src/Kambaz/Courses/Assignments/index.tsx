
import { ListGroup, Button, InputGroup, FormControl } from "react-bootstrap";
import { BsPlusLg, BsSearch, BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

export default function Assignments() {
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
        {[
          { id: 123, title: "A1 - ENV + HTML", available: "May 6", due: "May 13" },
          { id: 124, title: "A2 - CSS Basics", available: "May 10", due: "May 20" },
          { id: 125, title: "A3 - JavaScript Basics", available: "May 15", due: "May 27" },
        ].map(({ id, title, available, due }) => (
          <ListGroup.Item key={id} className="wd-assignment-list-item">
            <div className="wd-assignment-left">
              <BsGripVertical className="text-muted" />
              <FaCheckCircle className="text-success" />
              <div>
                <a href={`#/Kambaz/Courses/1234/Assignments/${id}`} className="wd-assignment-link">
                  {title}
                </a>
                <div className="wd-assignment-details">
                  Multiple Modules | Not available until {available} at 12:00am | Due {due} at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <IoEllipsisVertical className="wd-ellipsis-icon" />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
