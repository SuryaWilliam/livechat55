import { useState } from "react";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");

  const categories = [
    "Billing",
    "Technical Support",
    "General Inquiry",
    "Feedback",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, description, category } = formData;

    if (!username || !description || !category) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/chat/${data.sessionId}`);
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("Failed to create chat session. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to LiveChat</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="w-full p-2 border rounded"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Description of your problem
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Problem Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Start Chat
        </button>
      </form>
    </div>
  );
};

export default HomePage;
