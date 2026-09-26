import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, default: '' },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
}, { timestamps: true });

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  photos: { type: [photoSchema], default: [] },
}, { timestamps: true });

gallerySchema.index({ createdAt: -1 });

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  originalName: { type: String, required: true },
  fileName: { type: String, default: '' },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
}, { timestamps: true });

documentSchema.index({ createdAt: -1 });

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
export const CbseDocument = mongoose.models.CbseDocument || mongoose.model('CbseDocument', documentSchema);
