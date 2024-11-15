// components/owner/UserRoleManagement.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const UserRoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    // Request initial list of roles
    socket.emit("get_roles");

    // Listen for updates to roles
    socket.on("roles_update", (updatedRoles: Role[]) => {
      setRoles(updatedRoles);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("roles_update");
    };
  }, []);

  const handleAddRole = () => {
    if (newRole.name.trim()) {
      socket.emit("add_role", newRole);
      setNewRole({ name: "", permissions: [] });
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
  };

  const handleSaveEdit = () => {
    if (editingRole) {
      socket.emit("update_role", editingRole);
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      socket.emit("delete_role", { id: roleId });
    }
  };

  return (
    <div>
      <h3>User Role Management</h3>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            <strong>{role.name}</strong> - Permissions:{" "}
            {role.permissions.join(", ")}
            <button onClick={() => handleEditRole(role)}>Edit</button>
            <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingRole ? (
        <div>
          <h4>Edit Role</h4>
          <input
            type="text"
            value={editingRole.name}
            onChange={(e) =>
              setEditingRole({ ...editingRole, name: e.target.value })
            }
            placeholder="Role Name"
          />
          <textarea
            value={editingRole.permissions.join(", ")}
            onChange={(e) =>
              setEditingRole({
                ...editingRole,
                permissions: e.target.value
                  .split(",")
                  .map((perm) => perm.trim()),
              })
            }
            placeholder="Permissions (comma-separated)"
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditingRole(null)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>Add New Role</h4>
          <input
            type="text"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            placeholder="Role Name"
          />
          <textarea
            value={newRole.permissions.join(", ")}
            onChange={(e) =>
              setNewRole({
                ...newRole,
                permissions: e.target.value
                  .split(",")
                  .map((perm) => perm.trim()),
              })
            }
            placeholder="Permissions (comma-separated)"
          />
          <button onClick={handleAddRole}>Add Role</button>
        </div>
      )}
    </div>
  );
};

export default UserRoleManagement;
