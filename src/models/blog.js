import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true }, // Unique slug
  content: { type: String, required: true },
  image: { type: String, required: true }, // Image required
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  seoTitle: { type: String },
  metaKeywords: { type: String },
  excerpt: { type: String },
  tags: { type: [String], default: [] },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Optional
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
