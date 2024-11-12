// components/owner/UserRoleManagement.tsx

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  role: { name: string };
}

interface Role {
  _id: string;
  name: string;
}

const UserRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch("/api/owner/users"),
          fetch("/api/owner/roles"),
        ]);

        if (!usersRes.ok || !rolesRes.ok) {
          throw new Error("Failed to fetch users or roles");
        }

        setUsers(await usersRes.json());
        setRoles(await rolesRes.json());
      } catch (error) {
        setError("Could not load users or roles. Please try again.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError("Please select both a user and a role.");
      return;
    }

    try {
      const res = await fetch("/api/owner/userRoles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser, roleId: selectedRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser
            ? {
                ...user,
                role:
                  roles.find((role) => role._id === selectedRole) || user.role,
              }
            : user
        )
      );
      setSelectedUser("");
      setSelectedRole("");
    } catch (error) {
      setError("Could not update role. Please try again.");
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">User Role Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Loading users and roles...</p>
      ) : (
        <div>
          <div className="mb-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded mr-2"
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.role.name}
                </option>
              ))}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleUpdateRole}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Role
            </button>
          </div>

          <ul>
            {users.map((user) => (
              <li key={user._id} className="mb-4 border-b pb-2">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Role:</strong> {user.role.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
