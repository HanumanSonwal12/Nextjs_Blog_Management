import mongoose from 'mongoose';
import Category from './category'

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  seoTitle: { type: String },
  metaKeywords: { type: String },
  excerpt: { type: String },
  tags: { type: [String], default: [] },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // ✅ Must match model name exactly
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ Must match model name
  },
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
