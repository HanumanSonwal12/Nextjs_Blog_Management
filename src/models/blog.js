import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: 'draft' },
  seoTitle: { type: String },
  metaKeywords: { type: String },
  excerpt: { type: String },
  tags: { type: [String], default: [] },  // Tags array added
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
