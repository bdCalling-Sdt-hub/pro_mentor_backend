import { Schema, model, Types, Document } from 'mongoose';
import { TTask, TTaskGoal } from './taskGoal.interface';


const TaskSchema = new Schema<TTask>({
  taskName: { type: String, required: true },
  taskfiles: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending', required: true },
});


const TaskGoalSchema = new Schema<TTaskGoal>({
  goalName: { type: String, required: true },
  status: {
    type: String,
    enum: ['running', 'checking', 'completed'],
    default: 'running',
    required: true,
  },
  tasks: { type: [TaskSchema], required: false, default: [] },
  menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalProgress: { type: Number, required: true, default: 0 },
  taskCount: { type: Number, required: true, default: 3 },
});




const TaskGoal = model<TTaskGoal>('TaskGoal', TaskGoalSchema);

export default TaskGoal ;
