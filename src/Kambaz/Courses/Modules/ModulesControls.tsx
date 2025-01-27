import { FaPlus } from "react-icons/fa6";
import { BsCheckCircleFill } from "react-icons/bs";
import { Button, Dropdown } from "react-bootstrap";
import "./styles.css";

export default function ModulesControls() {
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button variant="light" size="lg" className="me-2 float-end" id="wd-view-progress">
        View Progress
      </Button>

      <Dropdown className="float-end me-2">
        <Dropdown.Toggle variant="dark" size="lg" id="wd-publish-all-btn">
          <BsCheckCircleFill className="me-2 text-success" /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <BsCheckCircleFill className="me-2 text-success" /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <BsCheckCircleFill className="me-2 text-success" /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item id="wd-unpublish-all-modules-and-items">
            <span className="text-danger">🚫</span> Unpublish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-modules-only">
            <span className="text-danger">🚫</span> Unpublish modules only
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="light" size="lg" className="me-2 float-end" id="wd-collapse-all">
        Collapse All
      </Button>

      <Button variant="danger" size="lg" className="float-end" id="wd-add-module-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>
    </div>
  );
}
