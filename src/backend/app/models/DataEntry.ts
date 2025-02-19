import { Schema, model } from 'mongoose';
import { ApplicationData } from '../../../shared/data';

export type IDataEntry = ApplicationData;

const DataEntrySchema = new Schema<IDataEntry>({
  id: Schema.ObjectId,
  location: String,
  start: Date,
  end: Date,
  author: String,
});

export const DataEntry = model<IDataEntry>('DataEntry', DataEntrySchema);
