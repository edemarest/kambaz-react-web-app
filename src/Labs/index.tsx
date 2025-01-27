import Lab1 from "./Lab1";
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";
import Lab2 from "./Lab2"; 
import Lab3 from "./Lab3";
export default function Labs() {
  return (
    <div>
      <p><strong>Assignment by:</strong> Ella Demarest</p>
      <p><strong>Section:</strong> CS4550.37031.202530</p>
      <h1>Labs</h1>
      <TOC />
      <Routes>
        <Route path="/" element={<Navigate to="Lab2" />} />
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2" element={<Lab2 />} />
        <Route path="Lab3" element={<Lab3 />} />
      </Routes>
    </div>
  );
}
