import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Rich Text HTML
  featuredImage: { type: String }, // image URL
  tags: [String],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  excerpt: { type: String },
  metaKeywords: { type: String },
  seoTitle: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
