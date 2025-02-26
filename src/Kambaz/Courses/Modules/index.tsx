import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { addModule } from "./reducer";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
  editing?: boolean;
}

interface Module {
  editing: any;
  _id: string;
  name: string;
  description: string;
  course: string;
  lessons?: Lesson[];
}

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div>
      {isFaculty && (
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            dispatch(addModule({ name: moduleName, course: cid }));
            setModuleName("");
          }}
        />
      )}
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.length > 0 ? (
          modules.map((module: Module) => (
            <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                <div className="wd-title p-3 ps-2 bg-secondary">
                {!module.editing && module.name}
                {module.editing && (
                  <input
                  className="form-control w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch({ type: "modules/updateModule", payload: { ...module, name: e.target.value } })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    dispatch({ type: "modules/updateModule", payload: { ...module, editing: false } });
                    }
                  }}
                  defaultValue={module.name}
                  />
                )}
                {isFaculty && (
                  <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId: string) =>
                    dispatch({ type: "modules/deleteModule", payload: moduleId })
                  }
                  editModule={(moduleId: string) =>
                    dispatch({ type: "modules/editModule", payload: moduleId })
                  }
                  />
                )}
                </div>
              {module.lessons && module.lessons.length > 0 ? (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: Lesson) => (
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
