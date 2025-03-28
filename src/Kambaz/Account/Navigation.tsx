import "./styles.css";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const location = useLocation();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser,
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div id="wd-account-navigation">
      {!currentUser ? (
        <>
          <Link
            to="/Kambaz/Account/Signin"
            className={`wd-nav-link ${isActive("/Kambaz/Account/Signin") ? "wd-active" : ""}`}
          >
            <div
              className={`wd-nav-bar ${isActive("/Kambaz/Account/Signin") ? "wd-active-bar" : ""}`}
            ></div>
            Signin
          </Link>
          <Link
            to="/Kambaz/Account/Signup"
            className={`wd-nav-link ${isActive("/Kambaz/Account/Signup") ? "wd-active" : ""}`}
          >
            <div
              className={`wd-nav-bar ${isActive("/Kambaz/Account/Signup") ? "wd-active-bar" : ""}`}
            ></div>
            Signup
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/Kambaz/Account/Profile"
            className={`wd-nav-link ${isActive("/Kambaz/Account/Profile") ? "wd-active" : ""}`}
          >
            <div
              className={`wd-nav-bar ${isActive("/Kambaz/Account/Profile") ? "wd-active-bar" : ""}`}
            ></div>
            Profile
          </Link>

          {currentUser && currentUser.role === "ADMIN" && (
            <Link
              to="/Kambaz/Account/Users"
              className={`wd-nav-link ${isActive("/Kambaz/Account/Users") ? "wd-active" : ""}`}
            >
              <div
                className={`wd-nav-bar ${isActive("/Kambaz/Account/Users") ? "wd-active-bar" : ""}`}
              ></div>
              Users
            </Link>
          )}
        </>
      )}
    </div>
  );
}
