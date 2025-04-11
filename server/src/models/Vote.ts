import mongoose, { Document, Schema } from 'mongoose';

// Interface representing a Vote document in MongoDB
export interface IVote extends Document {
  user: mongoose.Types.ObjectId;
  poll: mongoose.Types.ObjectId;
  selectedOption: number; // Index of the selected option
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const VoteSchema = new Schema<IVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    poll: {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
    },
    selectedOption: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          // This is a simple validation that will be further enhanced
          // when we retrieve the poll to check against actual options count
          return value >= 0;
        },
        message: 'Selected option must be a valid option index',
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound index to ensure a user can only vote once per poll
VoteSchema.index({ user: 1, poll: 1 }, { unique: true });

// Create and export the model
export default mongoose.model<IVote>('Vote', VoteSchema);
