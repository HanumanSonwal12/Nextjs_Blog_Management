import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: {
    type: String, // ✅ ye hona chahiye
    default: '',
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
