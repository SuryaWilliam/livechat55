// components/admin/UserManagement.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Request initial user list
    socket.emit("get_users");

    // Listen for user updates
    socket.on("user_update", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("user_update");
    };
  }, []);

  const handleActivateDeactivate = (userId: string, isActive: boolean) => {
    socket.emit("update_user_status", { userId, isActive: !isActive });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    socket.emit("update_user_role", { userId, role: newRole });
  };

  return (
    <div>
      <h3>User Management</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> ({user.email}) - Role: {user.role} -{" "}
            {user.isActive ? "Active" : "Inactive"}
            <button
              onClick={() => handleActivateDeactivate(user.id, user.isActive)}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => setSelectedUser(user)}>Edit Role</button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <h4>Edit Role for {selectedUser.name}</h4>
          <select
            value={selectedUser.role}
            onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
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

export default UserManagement;
