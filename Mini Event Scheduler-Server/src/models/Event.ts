import mongoose, { Document, Schema } from "mongoose";

export type Category = "Work" | "Personal" | "Other";

export interface IEvent extends Document {
  title: string;
  date: string;
  time: string;
  notes?: string;
  category: Category;
  archived: boolean;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  category: {
    type: String,
    enum: ["Work", "Personal", "Other"],
    required: true,
  },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IEvent>("Event", EventSchema);
