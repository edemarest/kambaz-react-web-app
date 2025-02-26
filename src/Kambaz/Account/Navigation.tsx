import "./styles.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const location = useLocation();
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);

  return (
    <div id="wd-account-navigation">
      {!currentUser ? (
        <>
          <Link to="/Kambaz/Account/Signin" className={`wd-nav-link ${location.pathname === "/Kambaz/Account/Signin" ? "wd-active" : ""}`}>
            <div className={`wd-nav-bar ${location.pathname === "/Kambaz/Account/Signin" ? "wd-active-bar" : ""}`}></div>
            Signin
          </Link>
          <Link to="/Kambaz/Account/Signup" className={`wd-nav-link ${location.pathname === "/Kambaz/Account/Signup" ? "wd-active" : ""}`}>
            <div className={`wd-nav-bar ${location.pathname === "/Kambaz/Account/Signup" ? "wd-active-bar" : ""}`}></div>
            Signup
          </Link>
        </>
      ) : (
        <Link to="/Kambaz/Account/Profile" className={`wd-nav-link ${location.pathname === "/Kambaz/Account/Profile" ? "wd-active" : ""}`}>
          <div className={`wd-nav-bar ${location.pathname === "/Kambaz/Account/Profile" ? "wd-active-bar" : ""}`}></div>
          Profile
        </Link>
      )}
    </div>
  );
}