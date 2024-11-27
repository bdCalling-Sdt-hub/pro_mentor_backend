import { Types } from 'mongoose';

export type TVideo  ={
  mentorId: Types.ObjectId;
  title: string;
  description?: string;
  category?:string;
  videoUrl: string;
  thumbnailUrl?: string;
  views: number;
}
