import { useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import "./index.css";
import * as client from "../../Account/client";
import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../Account/reducer";

export default function PeopleDetails({
  user,
  refreshUsers,
}: {
  user: any;
  refreshUsers?: () => void;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [userData, setUserData] = useState<any>(user || {});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData(user);
      setName(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  const saveUser = async () => {
    const [firstName, lastName] = name.split(" ");
    const updatedUser = {
      ...userData,
      firstName,
      lastName,
    };

    try {
      await client.updateUser(updatedUser);
      setUserData(updatedUser);
      if (currentUser._id === userData._id) {
        dispatch(setCurrentUser(updatedUser));
      }
      if (refreshUsers) await refreshUsers();
      setEditing(false);
      navigate("/Kambaz/Account/Users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    if (uid === currentUser._id) {
      dispatch(setCurrentUser(null));
      navigate("/Kambaz/Account/Signin");
    } else {
      if (refreshUsers) await refreshUsers();
      navigate("/Kambaz/Account/Users");
    }
  };

  if (!userData || !userData._id) return null;
  const isCurrentUser = currentUser && currentUser._id === userData._id;
  const canEdit = isCurrentUser || currentUser.role === "ADMIN";

  return (
    <div className="wd-people-details">
      <button
        onClick={() => navigate("/Kambaz/Account/Users")}
        className="btn wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-4">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4 wd-name text-center">
        {canEdit && !editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => saveUser()}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}
        {!editing ? (
          <div className="wd-name">
            {userData.firstName} {userData.lastName}
          </div>
        ) : (
          <FormControl
            className="w-50 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>
      <div className="mt-3 px-2">
        <b>Role:</b>{" "}
        {!editing ? (
          <span>{userData.role}</span>
        ) : (
          <select
            className="form-select w-50"
            value={userData.role}
            onChange={(e) =>
              setUserData({ ...userData, role: e.target.value })
            }
          >
            <option value="STUDENT">Student</option>
            <option value="TA">Assistant</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrator</option>
          </select>
        )}
        <br />
        <b>Email:</b>{" "}
        {!editing ? (
          <span>{userData.email}</span>
        ) : (
          <FormControl
            className="w-50 mt-2"
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
        <br />
        <b>Login ID:</b> <span>{userData.loginId}</span> <br />
        <b>Section:</b> <span>{userData.section}</span> <br />
        <b>Total Activity:</b> <span>{userData.totalActivity}</span>
      </div>
      <hr />
      {canEdit && (
        <>
          <button
            onClick={() => deleteUser(userData._id)}
            className="btn btn-danger float-end wd-delete"
          >
            Delete
          </button>
          <button
            onClick={() => navigate("/Kambaz/Account/Users")}
            className="btn btn-secondary float-start float-end me-2 wd-cancel"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
