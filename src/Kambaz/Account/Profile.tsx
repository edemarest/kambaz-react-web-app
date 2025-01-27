import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1 className="wd-profile-title">Profile</h1>
      <div className="wd-profile-form">
        <Form.Control defaultValue="alice" placeholder="username" className="wd-input" />
        <Form.Control defaultValue="123" placeholder="password" type="password" className="wd-input" />
        <Form.Control defaultValue="Alice" placeholder="First Name" className="wd-input" />
        <Form.Control defaultValue="Wonderland" placeholder="Last Name" className="wd-input" />
        <Form.Control defaultValue="2000-01-01" type="date" className="wd-input" />
        <Form.Control defaultValue="alice@wonderland.com" type="email" className="wd-input" />
        <Form.Select defaultValue="USER" className="wd-input">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </Form.Select>
        <Link to="/Kambaz/Account/Signin" className="btn wd-signout-btn">Signout</Link>
      </div>
    </div>
  );
}
