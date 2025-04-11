import mongoose, { Document, Schema } from 'mongoose';

// Interface representing a Poll document in MongoDB
export interface IPoll extends Document {
  question: string;
  options: string[];
  creator: mongoose.Types.ObjectId;
  totalVotes: number;
  optionVoteCounts: Map<number, number>;
  crossReferences: {
    poll: mongoose.Types.ObjectId;
    relationship: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const PollSchema = new Schema<IPoll>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (options: string[]) {
            return options.length >= 2 && options.length <= 10;
          },
          message: 'Poll must have between 2 and 10 options',
        },
      ],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    // Store count of votes for each option
    optionVoteCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    // Cross-references to other polls
    crossReferences: [
      {
        poll: {
          type: Schema.Types.ObjectId,
          ref: 'Poll',
        },
        relationship: {
          type: String,
          enum: ['related', 'follow-up', 'opposing', 'prerequisite', 'custom'],
          default: 'related',
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the model
export default mongoose.model<IPoll>('Poll', PollSchema);
