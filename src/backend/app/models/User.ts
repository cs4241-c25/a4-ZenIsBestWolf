import { Schema, model } from 'mongoose';
import { User as SharedUser } from '../../../shared/user';

export interface IUser extends SharedUser {
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, unique: true },
  password: String,
});

export const User = model<IUser>('User', UserSchema);
