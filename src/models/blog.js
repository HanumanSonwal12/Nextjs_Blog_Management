import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  tags: [{ type: String }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  excerpt: { type: String },
  metaKeywords: { type: String },
  seoTitle: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
