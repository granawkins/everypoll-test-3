import mongoose, { Document, Schema } from 'mongoose';

// Interface for Google OAuth data
interface GoogleOAuth {
  id: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

// Interface representing a User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture?: string;
  googleOAuth?: GoogleOAuth;
  createdPolls: mongoose.Types.ObjectId[];
  votes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    googleOAuth: {
      id: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values
      },
      email: String,
      accessToken: String,
      refreshToken: String,
    },
    createdPolls: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Poll',
      },
    ],
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vote',
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the model
export default mongoose.model<IUser>('User', UserSchema);
