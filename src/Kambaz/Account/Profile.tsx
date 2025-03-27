import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";
import { Form } from "react-bootstrap";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentUser);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/Kambaz/Account/Signin");
    } else {
      setFormData(currentUser);
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  const updateProfile = async () => {
    try {
      const updated = await client.updateUser(formData);
      dispatch(setCurrentUser(updated));
      setIsEditing(false);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {isEditing ? (
        <>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Username"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="First Name"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last Name"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={formData.role} disabled>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
              <option value="TA">Teaching Assistant</option>
            </Form.Select>
          </Form.Group>

          <button onClick={updateProfile} className="btn btn-primary w-100 mb-2">
            Update Profile
          </button>
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary w-100 mb-3">
            Cancel
          </button>
        </>
      ) : (
        <>
          <p><strong>Username:</strong> {currentUser.username}</p>
          <p><strong>First Name:</strong> {currentUser.firstName}</p>
          <p><strong>Last Name:</strong> {currentUser.lastName}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Role:</strong> {currentUser.role}</p>

          <button onClick={() => setIsEditing(true)} className="btn btn-primary w-100 mb-2">
            Edit Profile
          </button>
        </>
      )}

      <button onClick={signout} className="btn btn-danger w-100" id="wd-signout-btn">
        Sign out
      </button>
    </div>
  );
}
