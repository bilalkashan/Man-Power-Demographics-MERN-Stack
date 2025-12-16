import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../api";
import { toast } from "react-toastify";

const AdminNews = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Company News");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await api.get("/news");
      setNewsList(res.data.news || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load news");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", title);
      form.append("category", category);
      form.append("summary", summary);
      form.append("content", content);
      form.append("isPublished", isPublished ? "true" : "false");
      if (image) form.append("image", image);

      const res = await api.post("/news", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("News created");
        setTitle("");
        setCategory("");
        setSummary("");
        setContent("");
        setImage(null);
        fetchNews();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create news");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success("Deleted");
      fetchNews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <AdminLayout pageTitle="Manage News">
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Create News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="p-2 border rounded"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="Company News">Company News</option>
              <option value="Events">Events</option>
              <option value="Policy Update">Policy Update</option>
            </select>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary"
              className="p-2 border rounded col-span-2"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="p-2 border rounded col-span-2"
              rows={6}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />{" "}
              Published
            </label>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Existing News</h3>
          {newsList.length === 0 ? (
            <p className="text-gray-500">No news items</p>
          ) : (
            <ul className="space-y-3">
              {newsList.map((n) => (
                <li key={n._id} className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-500">
                      {n.category} •{" "}
                      {new Date(n.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNews;
