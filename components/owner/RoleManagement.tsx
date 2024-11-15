// components/owner/RoleManagement.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface UserRole {
  userId: string;
  name: string;
  email: string;
  role: string;
}

const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);

  useEffect(() => {
    // Request the initial list of users and their roles
    socket.emit("get_user_roles");

    // Listen for updates to user roles
    socket.on("user_roles_update", (updatedUsers: UserRole[]) => {
      setUsers(updatedUsers);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("user_roles_update");
    };
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    socket.emit("update_user_role", { userId, role: newRole });
    setSelectedUser(null); // Close the editing modal or state
  };

  return (
    <div>
      <h3>Role Management</h3>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            <strong>{user.name}</strong> ({user.email}) - Role: {user.role}
            <button onClick={() => setSelectedUser(user)}>Edit Role</button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <h4>Edit Role for {selectedUser.name}</h4>
          <select
            value={selectedUser.role}
            onChange={(e) =>
              handleRoleChange(selectedUser.userId, e.target.value)
            }
          >
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="user">User</option>
          </select>
          <button onClick={() => setSelectedUser(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
