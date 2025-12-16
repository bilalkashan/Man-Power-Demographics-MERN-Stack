import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, X, Search, Mail } from "lucide-react";
import api from "../api";
import { toast } from "react-toastify";
import AdminLayout from "../admin/AdminLayout";

const CheckMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search
  useEffect(() => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/messages");
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read if not already
    if (!message.isRead) {
      try {
        await api.patch(`/messages/${message._id}/read`);
        setMessages(
          messages.map((msg) =>
            msg._id === message._id ? { ...msg, isRead: true } : msg
          )
        );
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const getUnreadCount = () => {
    return messages.filter((msg) => !msg.isRead).length;
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Check Messages">
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Loading messages...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Check Messages">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">View and manage customer inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Messages"
          value={messages.length}
          color="bg-blue-500"
        />
        <StatCard label="Unread" value={getUnreadCount()} color="bg-red-500" />
        <StatCard
          label="Read"
          value={messages.filter((msg) => msg.isRead).length}
          color="bg-green-500"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <motion.tr
                    key={message._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 transition ${
                      !message.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {message.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          message.isRead
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {message.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewMessage(message)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedMessage(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {selectedMessage.subject}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">From</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedMessage.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Message
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Received on:{" "}
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMessage(null);
                }}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color }) => (
  <motion.div
    whileHover={{ translateY: -5 }}
    className={`${color} text-white rounded-lg shadow-md p-6 text-center`}
  >
    <p className="text-sm font-medium opacity-90">{label}</p>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </motion.div>
);

export default CheckMessages;
