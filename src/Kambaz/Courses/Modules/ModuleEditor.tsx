
import { Modal, Button } from "react-bootstrap";

export default function ModuleEditor({
  dialogTitle,
  moduleName,
  setModuleName,
  addModule,
  show,
  onHide,
}: {
  dialogTitle: string;
  moduleName: string;
  setModuleName: (name: string) => void;
  addModule: (name: string) => void;
  show: boolean;
  onHide: () => void;
}) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          className="form-control"
          value={moduleName}
          placeholder="Module Name"
          onChange={(e) => setModuleName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => addModule(moduleName)}>
          Add Module
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
