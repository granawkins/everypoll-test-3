import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Types for poll data
interface Option {
  id: string;
  text: string;
  votes?: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  options: Option[];
  creatorId: string;
  creatorName?: string;
  totalVotes?: number;
  userVote?: string; // ID of the option the user voted for, if any
}

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

// Initial state
const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

// Async thunks
export const fetchPolls = createAsyncThunk(
  'polls/fetchPolls',
  async (
    { page, limit = 10, search = '' }: { page: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/polls?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`
      );
      return {
        polls: response.data.polls,
        hasMore: response.data.hasMore,
        page,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch polls');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const fetchPollById = createAsyncThunk(
  'polls/fetchPollById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/polls/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch poll');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const createPoll = createAsyncThunk(
  'polls/createPoll',
  async (
    pollData: {
      question: string;
      description?: string;
      isPublic: boolean;
      options: { text: string }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/polls', pollData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to create poll');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const votePoll = createAsyncThunk(
  'polls/votePoll',
  async (
    { pollId, optionId }: { pollId: string; optionId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/polls/${pollId}/vote`, { optionId });
      return { ...response.data, pollId, optionId };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to vote');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Slice
const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    resetPollsState: (state) => {
      return initialState;
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPolls
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        // If it's the first page, replace polls; otherwise, append
        if (action.payload.page === 1) {
          state.polls = action.payload.polls;
        } else {
          state.polls = [...state.polls, ...action.payload.polls];
        }
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch polls';
      })
      // fetchPollById
      .addCase(fetchPollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPoll = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch poll';
      })
      // createPoll
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = [action.payload, ...state.polls];
        state.currentPoll = action.payload;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create poll';
      })
      // votePoll
      .addCase(votePoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(votePoll.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the current poll if it matches
        if (state.currentPoll && state.currentPoll.id === action.payload.pollId) {
          state.currentPoll = {
            ...state.currentPoll,
            userVote: action.payload.optionId,
            options: state.currentPoll.options.map(option => {
              if (option.id === action.payload.optionId) {
                return {
                  ...option,
                  votes: (option.votes || 0) + 1
                };
              }
              return option;
            }),
            totalVotes: (state.currentPoll.totalVotes || 0) + 1
          };
        }

        // Update the poll in the list if it exists
        state.polls = state.polls.map(poll => {
          if (poll.id === action.payload.pollId) {
            return {
              ...poll,
              userVote: action.payload.optionId,
              options: poll.options.map(option => {
                if (option.id === action.payload.optionId) {
                  return {
                    ...option,
                    votes: (option.votes || 0) + 1
                  };
                }
                return option;
              }),
              totalVotes: (poll.totalVotes || 0) + 1
            };
          }
          return poll;
        });
      })
      .addCase(votePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to vote';
      });
  },
});

export const { resetPollsState, clearCurrentPoll } = pollsSlice.actions;
export default pollsSlice.reducer;
