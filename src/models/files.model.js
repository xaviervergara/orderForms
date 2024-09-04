import mongoose from 'mongoose';

const fileCollection = 'files';

const fileSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Pending',
  },
});

export const fileModel = mongoose.model(fileCollection, fileSchema);
