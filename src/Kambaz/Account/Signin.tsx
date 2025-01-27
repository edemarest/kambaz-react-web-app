import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h1 className="wd-signin-title">Signin</h1>
      <div className="wd-signin-form">
        <Form.Control id="wd-username"
              placeholder="username"
              className="wd-input mb-2"/>
        <Form.Control id="wd-password"
              placeholder="password" type="password"
              className="wd-input mb-3"/>
        <div className="wd-button-container">
          <Link id="wd-signin-btn"
                to="/Kambaz/Account/Profile"
                className="btn btn-primary wd-signin-btn">
                Sign In </Link>
        </div>
        <div className="wd-button-container">
          <Link id="wd-signup-link" to="/Kambaz/Account/Signup" className="wd-signup-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
