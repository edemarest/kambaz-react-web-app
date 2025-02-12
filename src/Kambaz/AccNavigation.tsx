import { Link, useLocation } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";

export default function KambazNavigation() {
  const { pathname } = useLocation();

  const links = [
    { label: "Dashboard", path: "/Kambaz/Dashboard", icon: AiOutlineDashboard, id: "wd-dashboard-link" },
    { label: "Courses", path: "/Kambaz/Dashboard", icon: LiaBookSolid, id: "wd-course-link" },
    { label: "Calendar", path: "/Kambaz/Calendar", icon: IoCalendarOutline, id: "wd-calendar-link" },
    { label: "Inbox", path: "/Kambaz/Inbox", icon: FaInbox, id: "wd-inbox-link" },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid, id: "wd-labs-link" },
  ];

  return (
    <div id="wd-kambaz-navigation" style={{ width: 120 }}
         className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      
      {/* NEU Logo Link */}
      <a id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
         className="list-group-item bg-black border-0 text-center">
        <img src="/images/logo.png" width="75px" />
      </a>
      <br />

      {/* Account Link */}
      <Link to="/Kambaz/Account" id="wd-account-link"
            className={`list-group-item text-center border-0 bg-black 
            ${pathname.includes("Account") ? "text-danger bg-white" : "text-white"}`}>
        <FaRegCircleUser className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </Link>
      <br />

      {/* Navigation Links */}
      {links.map(({ label, path, icon: Icon, id }) => (
        <Link key={id} to={path} id={id}
              className={`list-group-item text-center border-0 bg-black 
              ${pathname.includes(label) ? "text-danger bg-white" : "text-white"}`}>
          <Icon className={`fs-1 ${pathname.includes(label) ? "text-danger" : "text-white"}`} />
          <br />
          {label}
        </Link>
      ))}
    </div>
  );
}
