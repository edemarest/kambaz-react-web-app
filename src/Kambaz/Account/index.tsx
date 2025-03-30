import Profile from "./Profile";
import { Routes, Route, Navigate } from "react-router";
import Signup from "./Signup";
import Signin from "./Signin";
import AccountNavigation from "./Navigation";
import { useSelector } from "react-redux";
import Users from "./Users";

export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-account-screen">
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <AccountNavigation />
            </td>
            <td valign="top" style={{ width: "100%" }}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={currentUser ? "Profile" : "Signin"} />}
                />
                <Route path="Signin" element={<Signin />} />
                <Route path="Profile" element={<Profile />} />
                <Route path="Signup" element={<Signup />} />
                <Route path="/Users" element={<Users />} />
                <Route path="/Users/:uid" element={<Users />} />
              </Routes>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          position: "fixed",
          bottom: "12px",
          right: "12px",
          fontSize: "0.75rem",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "0.5rem 0.75rem",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          maxWidth: "220px",
          lineHeight: "1.3",
        }}
      >
        <div>Quizzes Project by Ella Demarest</div>
        <div>Web Dev Section CS4550.37031.202530</div>
        <div>
          <a
            href="https://github.com/edemarest/kambaz-react-web-app/tree/project"
            target="_blank"
            rel="noreferrer"
          >
            Frontend Repository
          </a>
        </div>
        <div>
          <a
            href="https://github.com/edemarest/kambaz-node-server-app/tree/project"
            target="_blank"
            rel="noreferrer"
          >
            Backend Repository
          </a>
        </div>
      </div>
    </div>
  );
}
