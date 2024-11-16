import { model, Schema } from 'mongoose';
import { TVideo } from './video.interface';

const VideoSchema = new Schema<TVideo>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Video = model<TVideo>('Video', VideoSchema);
