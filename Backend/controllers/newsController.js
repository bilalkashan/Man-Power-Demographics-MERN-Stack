import News from "../models/News.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getNews = async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const query = { isPublished: true };
    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .skip(parseInt(skip) || 0)
      .limit(parseInt(limit) || 0);
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    res.json({ success: true, news: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, summary, content, author, tags, isPublished } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new News({
      title,
      summary,
      content,
      image: imagePath,
      author,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      isPublished: isPublished === "false" ? false : true,
    });

    const saved = await newItem.save();
    res.status(201).json({ success: true, news: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    if (updates.tags && !Array.isArray(updates.tags)) {
      updates.tags = updates.tags.split(",").map((t) => t.trim());
    }

    const item = await News.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    res.json({ success: true, news: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "News not found" });

    // delete image file if exists and not an external URL
    if (item.image && !item.image.startsWith("http")) {
      const rel = item.image.replace(/^\/+/, "");
      const filePath = path.join(__dirname, "..", rel);
      await fs.promises.unlink(filePath).catch((e) => {
        if (e.code !== "ENOENT")
          console.warn("Failed to delete news image", filePath, e.message);
      });
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "News deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "News not found" });
    item.isPublished = !item.isPublished;
    await item.save();
    res.json({ success: true, news: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
