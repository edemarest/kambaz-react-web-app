import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ListGroup, Alert } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import * as client from "./client";

export default function Modules() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [modules, setModules] = useState<any[]>([]);
  const [moduleName, setModuleName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isFaculty = currentUser?.role === "FACULTY";

  const loadModules = useCallback(async () => {
    try {
      const data = await client.fetchModulesForCourse(cid!);
      setModules(data);
      setError(null);
    } catch (error) {
      setError("Error fetching modules. Please try again.");
    }
  }, [cid]);

  const handleCreate = async () => {
    try {
      const newModule = await client.createModule(cid!, { name: moduleName });
      setModules([...modules, newModule]);
      setModuleName("");
      setError(null);
    } catch (error) {
      setError("Error creating module. Please try again.");
    }
  };

  const handleDelete = async (moduleId: string) => {
    try {
      await client.deleteModule(moduleId);
      setModules(modules.filter((m) => m._id !== moduleId));
      setError(null);
    } catch (error) {
      setError("Error deleting module. Please try again.");
    }
  };

  const handleUpdate = async (updatedModule: any) => {
    try {
      await client.updateModule(updatedModule._id, updatedModule);
      setModules(modules.map((m) => m._id === updatedModule._id ? updatedModule : m));
      setError(null);
    } catch (error) {
      setError("Error updating module. Please try again.");
    }
  };

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={handleCreate}
        />
      )}
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.length > 0 ? (
          modules.map((module) => (
            <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                {!module.editing ? (
                  module.name
                ) : (
                  <input
                    className="form-control w-50 d-inline-block"
                    value={module.name}
                    onChange={(e) =>
                      setModules(modules.map((m) =>
                        m._id === module._id ? { ...m, name: e.target.value } : m
                      ))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdate({ ...module, editing: false });
                      }
                    }}
                  />
                )}
                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={handleDelete}
                    editModule={(id: string) =>
                      setModules(modules.map((m) =>
                        m._id === id ? { ...m, editing: true } : m
                      ))
                    }
                  />
                )}
              </div>
              {module.lessons && module.lessons.length > 0 ? (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="p-3 ps-2 text-muted">No lessons available</div>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-muted">No modules available for this course.</p>
        )}
      </ListGroup>
    </div>
  );
}
