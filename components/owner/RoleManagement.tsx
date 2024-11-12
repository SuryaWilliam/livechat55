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
        setError("Could not load roles. Please try again.");
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleCreateRole = async () => {
    if (!newRole.name.trim() || !newRole.permissions.trim()) {
      setError("Please provide both role name and permissions.");
      return;
    }

    try {
      const res = await fetch("/api/owner/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newRole.name,
          permissions: newRole.permissions
            .split(",")
            .map((perm) => perm.trim()),
        }),
      });

      if (!res.ok) throw new Error("Failed to create role");

      const createdRole = await res.json();
      setRoles((prevRoles) => [...prevRoles, createdRole]);
      setNewRole({ name: "", permissions: "" });
    } catch (error) {
      setError("Could not create role. Please try again.");
      console.error("Error creating role:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Role Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Loading roles...</p>
      ) : (
        <ul>
          {roles.map((role) => (
            <li key={role._id} className="mb-4 border-b pb-2">
              <p>
                <strong>Role Name:</strong> {role.name}
              </p>
              <p>
                <strong>Permissions:</strong> {role.permissions.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <h3 className="text-md font-semibold">Create New Role</h3>
        <input
          type="text"
          name="name"
          value={newRole.name}
          onChange={handleInputChange}
          placeholder="Role Name"
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          name="permissions"
          value={newRole.permissions}
          onChange={handleInputChange}
          placeholder="Permissions (comma-separated)"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreateRole}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Role
        </button>
      </div>
    </div>
  );
};

export default RoleManagement;
