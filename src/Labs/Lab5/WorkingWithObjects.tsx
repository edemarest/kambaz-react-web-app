import React, { useState } from "react";
import { FormControl, FormCheck } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });

    const [module, setModule] = useState({
        id: "", name: "", description: "", course: ""
    });

    const [moduleName, setModuleName] = useState<string | null>(null);
    const [moduleData, setModuleData] = useState<string | null>(null);

    const ASSIGNMENT_API = `${REMOTE_SERVER}/lab5/assignment`;
    const MODULE_API = `${REMOTE_SERVER}/lab5/module`;

    return (
        <div>
            <h3>Working With Objects</h3>

            <h4>Modifying Assignment Title</h4>
            <a className="btn btn-primary me-2"
                href={`${ASSIGNMENT_API}/title/${assignment.title}`}>
                Update Title
            </a>
            <FormControl className="mb-2" defaultValue={assignment.title}
                onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />

            <h4>Assignment Score</h4>
            <a className="btn btn-success me-2"
                href={`${ASSIGNMENT_API}/score/${assignment.score}`}>
                Update Score
            </a>
            <FormControl className="mb-2" type="number" defaultValue={assignment.score}
                onChange={(e) => setAssignment({ ...assignment, score: Number(e.target.value) })} />

            <h4>Assignment Completed</h4>
            <a className="btn btn-warning me-2"
                href={`${ASSIGNMENT_API}/completed/${assignment.completed}`}>
                Update Completed
            </a>
            <FormCheck
                label="Completed"
                type="checkbox"
                checked={assignment.completed}
                onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}
            />

            <hr />

            <a
                href="#"
                className="btn btn-info me-2"
                onClick={async (e) => {
                    e.preventDefault();
                    const res = await fetch(`${MODULE_API}`);
                    const data = await res.json();
                    setModule(data);
                    setModuleData(JSON.stringify(data));
                }}
            >
                Get Module
            </a>
            {moduleData && <p>Module Data: {moduleData}</p>}

            <a
                href="#"
                className="btn btn-secondary me-2"
                onClick={async (e) => {
                    e.preventDefault();
                    const res = await fetch(`${MODULE_API}/name`);
                    const name = await res.text();
                    setModuleName(name);
                }}
            >
                Get Module Name
            </a>
            {moduleName && <p>Module Name: {moduleName}</p>}

            <FormControl className="my-2" placeholder="New Module Name"
                defaultValue={module.name}
                onChange={(e) => setModule({ ...module, name: e.target.value })} />
            <a className="btn btn-primary me-2"
                href={`${MODULE_API}/name/${module.name}`}>
                Update Module Name
            </a>

            <FormControl className="my-2" placeholder="New Module Description"
                defaultValue={module.description}
                onChange={(e) => setModule({ ...module, description: e.target.value })} />
            <a className="btn btn-dark"
                href={`${MODULE_API}/description/${module.description}`}>
                Update Module Description
            </a>
        </div>
    );
}
