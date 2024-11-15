// components/owner/SavedReplies.tsx
import { useEffect, useState } from "react";
import socket from "../../lib/socket";

interface SavedReply {
  id: string;
  title: string;
  content: string;
}

const SavedReplies: React.FC = () => {
  const [replies, setReplies] = useState<SavedReply[]>([]);
  const [newReply, setNewReply] = useState({ title: "", content: "" });
  const [editingReply, setEditingReply] = useState<SavedReply | null>(null);

  useEffect(() => {
    // Request the initial list of saved replies
    socket.emit("get_saved_replies");

    // Listen for updates to saved replies
    socket.on("saved_replies_update", (updatedReplies: SavedReply[]) => {
      setReplies(updatedReplies);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("saved_replies_update");
    };
  }, []);

  const handleAddReply = () => {
    if (newReply.title.trim() && newReply.content.trim()) {
      socket.emit("add_saved_reply", newReply);
      setNewReply({ title: "", content: "" });
    }
  };

  const handleEditReply = (reply: SavedReply) => {
    setEditingReply(reply);
  };

  const handleSaveEdit = () => {
    if (editingReply) {
      socket.emit("update_saved_reply", editingReply);
      setEditingReply(null);
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (confirm("Are you sure you want to delete this reply?")) {
      socket.emit("delete_saved_reply", { id: replyId });
    }
  };

  return (
    <div>
      <h3>Saved Replies</h3>
      <ul>
        {replies.map((reply) => (
          <li key={reply.id}>
            <strong>{reply.title}</strong>: {reply.content}
            <button onClick={() => handleEditReply(reply)}>Edit</button>
            <button onClick={() => handleDeleteReply(reply.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editingReply ? (
        <div>
          <h4>Edit Reply</h4>
          <input
            type="text"
            value={editingReply.title}
            onChange={(e) =>
              setEditingReply({ ...editingReply, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={editingReply.content}
            onChange={(e) =>
              setEditingReply({ ...editingReply, content: e.target.value })
            }
            placeholder="Content"
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditingReply(null)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>Add New Reply</h4>
          <input
            type="text"
            value={newReply.title}
            onChange={(e) =>
              setNewReply({ ...newReply, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={newReply.content}
            onChange={(e) =>
              setNewReply({ ...newReply, content: e.target.value })
            }
            placeholder="Content"
          />
          <button onClick={handleAddReply}>Add Reply</button>
        </div>
      )}
    </div>
  );
};

export default SavedReplies;
