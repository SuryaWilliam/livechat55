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
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndRoles();
  }, []);

  const updateUserRole = async () => {
    try {
      const res = await fetch("/api/owner/userRoles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser, roleName: selectedRole }),
      });
      if (!res.ok) throw new Error("Failed to update user role");

      const updatedUser = await res.json();
      alert(
        `Role updated to ${selectedRole} for user ${updatedUser.user.name}`
      );
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">User Role Management</h2>
      <select
        onChange={(e) => setSelectedUser(e.target.value)}
        value={selectedUser}
        className="w-full mb-2 p-2 border rounded-md"
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} - {user.role.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setSelectedRole(e.target.value)}
        value={selectedRole}
        className="w-full mb-2 p-2 border rounded-md"
      >
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role._id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <button
        onClick={updateUserRole}
        className="py-2 px-4 bg-blue-500 text-white rounded-md"
      >
        Update Role
      </button>
    </div>
  );
};

export default UserRoleManagement;
