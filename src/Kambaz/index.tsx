import { Routes, Route, Navigate, useNavigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./AccNavigation";
import Courses from "./Courses";
import "./styles.css";

export default function Kambaz() {

  const goToLabs = () => {
    window.location.href = "/#/Labs"; 
  };

  return (
    <div id="wd-kambaz">
      <div className="wd-top-right-button">
        <button onClick={goToLabs} className="wd-landing-button">
          Landing Page
        </button>
      </div>
      <table width="100%">
        <tr>
          <td valign="top">
            <KambazNavigation />
          </td>
          <td valign="top">
            <div className="wd-main-content-offset p-3">
              <Routes>
                <Route path="/" element={<Navigate to="Account" />} />
                <Route path="/Account/*" element={<Account />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Courses/:cid/*" element={<Courses />} />
              </Routes>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
}
