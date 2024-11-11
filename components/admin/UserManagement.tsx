// components/admin/UserManagement.tsx

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !isActive }),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? updatedUser : user))
        );
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-2">User Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="mb-2 flex justify-between items-center">
            <p>
              {user.name} ({user.email}) - {user.role}
            </p>
            <button
              onClick={() => toggleUserStatus(user._id, user.isActive)}
              className={`py-1 px-3 rounded-md ${
                user.isActive
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {user.isActive ? "Active" : "Deactivated"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
