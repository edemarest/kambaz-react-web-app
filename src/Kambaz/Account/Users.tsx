import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PeopleTable from "../Courses/People/Table";
import * as client from "./client";
import { FormControl, InputGroup } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import "./index.css";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const { uid } = useParams();
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  const filterUsersByName = async (name: string) => {
    setSearchTerm(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await client.findAll();
      setUsers(data);
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const profile = await client.profile();
      } catch (e) {
        console.warn("Session not active or user not signed in.");
      }
    };

    restoreSession();
    fetchUsers();
  }, []);

  return (
    <div>
      <button onClick={createUser} className="float-end btn btn-danger wd-add-people">
        <FaPlus className="me-2" />
        Users
      </button>

      <h3 style={{ textAlign: "center" }}>Users</h3>

      <div className="d-flex mb-3 gap-2">
        {/* Search Bar */}
        <InputGroup className="w-50">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => filterUsersByName(e.target.value)}
          />
        </InputGroup>

        {/* Role Filter Dropdown */}
        <select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select w-25"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      <PeopleTable
        users={users}
        selectedUser={users.find((u) => u._id === uid)}
        refreshUsers={fetchUsers}
      />
    </div>
  );
}
