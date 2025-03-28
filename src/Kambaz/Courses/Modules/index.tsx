import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import * as client from "./client";
import {
  setModules,
  addModule,
  updateModule,
  deleteModule as deleteModuleAction,
} from "./reducer";

export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const modules = useSelector((state: any) => state.modules.modules);
  const [moduleName, setModuleName] = useState("");
  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await client.fetchModulesForCourse(cid!);
        dispatch(setModules(data));
      } catch (error) {
        console.error("Error loading modules:", error);
      }
    };

    fetchModules();
  }, [cid, dispatch]);

  const handleCreate = async (name: string) => {
    try {
      const newModule = await client.createModule(cid!, { name });
      dispatch(addModule(newModule));
      setModuleName(""); 
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };  

  const handleDelete = async (moduleId: string) => {
    try {
      await client.deleteModule(moduleId);
      dispatch(deleteModuleAction(moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleUpdate = async (updatedModule: any) => {
    try {
      await client.updateModule(updatedModule._id, updatedModule);
      dispatch(updateModule({ ...updatedModule, editing: false }));
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div>
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
          modules.map((module: any) => (
            <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                {!module.editing ? (
                  module.name
                ) : (
                  <input
                    className="form-control w-50 d-inline-block"
                    value={module.name}
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdate(module);
                      }
                    }}
                  />
                )}
                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={handleDelete}
                    editModule={() =>
                      dispatch(
                        updateModule({ ...module, editing: true })
                      )
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
