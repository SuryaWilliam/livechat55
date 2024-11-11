// components/owner/RoleManagement.tsx

import { useState, useEffect } from "react";

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/owner/roles");
        if (!res.ok) throw new Error("Failed to fetch roles");

        const data = await res.json();
        setRoles(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    try {
      const res = await fetch("/api/owner/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRole.name,
          permissions: newRole.permissions.split(",").map((p) => p.trim()),
        }),
      });
      if (!res.ok) throw new Error("Failed to create role");

      const createdRole = await res.json();
      setRoles([...roles, createdRole]);
      setNewRole({ name: "", permissions: "" });
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const res = await fetch("/api/owner/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete role");

      setRoles(roles.filter((role) => role._id !== id));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return <p>Loading roles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">Role Management</h2>
      <ul>
        {roles.map((role) => (
          <li key={role._id} className="flex justify-between mb-2">
            <p>{role.name}</p>
            <button
              onClick={() => handleDeleteRole(role._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Role Name"
        value={newRole.name}
        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        className="block w-full p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Permissions (comma-separated)"
        value={newRole.permissions}
        onChange={(e) =>
          setNewRole({ ...newRole, permissions: e.target.value })
        }
        className="block w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleCreateRole}
        className="py-2 px-4 bg-blue-500 text-white rounded-md"
      >
        Create Role
      </button>
    </div>
  );
};

export default RoleManagement;
