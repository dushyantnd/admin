import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  cloudinaryId: { type: String, required: true }, // Cloudinary public ID
  url: { type: String, required: true }, // Cloudinary URL
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.File || mongoose.model('File', fileSchema);
