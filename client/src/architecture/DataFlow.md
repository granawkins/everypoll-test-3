# EveryPoll Data Flow

This document describes how data flows through the EveryPoll application and defines the key API integration points between the frontend and backend.

## Data Flow Overview

The EveryPoll application follows a unidirectional data flow pattern:

1. **User Interaction** → Triggers events/actions
2. **Actions** → Call API endpoints or update local state
3. **API Responses** → Update global state (Context/Store)
4. **State Changes** → Trigger re-renders of components
5. **Components** → Render based on current state

```
┌─────────────────┐         ┌─────────────┐         ┌───────────────┐
│  User Interface │         │             │         │               │
│  (Components)   │─Events──►  Actions/   │─Calls───►   Backend     │
│                 │         │  Handlers   │         │   API         │
└───────┬─────────┘         └─────┬───────┘         └───────┬───────┘
        │                         │                         │
        │                         │                         │
        │                   ┌─────▼───────┐                 │
        │                   │  Global     │                 │
        │                   │  State      │◄────Responses───┘
        │                   │  (Context)  │
        │                   └─────┬───────┘
        │                         │
        │                         │
┌───────▼─────────┐               │
│  UI Updates     │◄──────────────┘
│  (Re-renders)   │
└─────────────────┘
```

## Key Data Flows

### 1. Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Login Form  │───►│ Auth Action │───►│  Auth API   │───►│  Auth       │
│ Component   │    │ (login)     │    │  Endpoint   │    │  Context    │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
┌─────────────┐                                                 │
│ Protected   │◄────────────────────────────────────────────────┘
│ Components  │
└─────────────┘
```

**Login Process:**
1. User enters credentials in LoginModal component
2. Component calls `login()` function from AuthContext
3. AuthContext makes API call to `/api/auth/login`
4. On success, JWT token is stored and user data is saved to AuthContext
5. UI updates to reflect authenticated state

### 2. Poll Voting Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PollCard    │───►│ Vote Action │───►│  Votes API  │───►│  Polls      │
│ Component   │    │ (votePoll)  │    │  Endpoint   │    │  Context    │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
┌─────────────┐                                                 │
│ PollCard    │◄────────────────────────────────────────────────┘
│ (Updated)   │
└─────────────┘
```

**Vote Process:**
1. User selects an option and clicks vote in PollCard component
2. Component calls `votePoll(pollId, optionId)` from PollsContext
3. PollsContext makes optimistic update to local state
4. API call is made to `/api/polls/{pollId}/vote`
5. On success, poll is updated with new vote count
6. On error, optimistic update is reverted

### 3. Poll Creation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Poll        │───►│Create Action│───►│  Polls API  │───►│  Polls      │
│ Creation    │    │(createPoll) │    │  Endpoint   │    │  Context    │
│ Form        │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
┌─────────────┐                                                 │
│ Poll Feed   │◄────────────────────────────────────────────────┘
│ (Updated)   │
└─────────────┘
```

**Creation Process:**
1. User fills out and submits PollCreationForm
2. Form calls `createPoll(pollData)` from PollsContext
3. API call is made to `/api/polls`
4. On success, new poll is added to PollsContext
5. User is redirected to the new poll or feed

### 4. Cross-Reference Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Cross-Ref   │───►│ CrossRef    │───►│ CrossRef    │───►│  Polls      │
│ Component   │    │ Action      │    │ API Endpoint│    │  Context    │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                │
┌─────────────┐                                                 │
│ PollCard    │◄────────────────────────────────────────────────┘
│ (Updated)   │
└─────────────┘
```

**Cross-Reference Process:**
1. User searches and selects related poll in CrossReferenceSearch component
2. Component calls `crossReferencePolls(poll1Id, poll2Id)` from PollsContext
3. API call is made to `/api/polls/{poll1Id}/crossref/{poll2Id}`
4. On success, both polls are updated with cross-reference data
5. UI updates to show cross-reference indicators

## API Integration Points

### Authentication API

| Endpoint            | Method | Description           | Request Body                           | Response                             |
|---------------------|--------|-----------------------|----------------------------------------|--------------------------------------|
| `/api/auth/login`   | POST   | User login            | `{ email, password }`                  | `{ token, user }`                    |
| `/api/auth/signup`  | POST   | User registration     | `{ name, email, password }`            | `{ token, user }`                    |
| `/api/auth/google`  | POST   | Google OAuth          | `{ token }`                            | `{ token, user }`                    |
| `/api/auth/logout`  | POST   | User logout           | -                                      | `{ success }`                        |
| `/api/auth/me`      | GET    | Get current user      | -                                      | `{ user }`                           |

### Polls API

| Endpoint                            | Method | Description                 | Request Body                           | Response                                 |
|-------------------------------------|--------|-----------------------------|----------------------------------------|------------------------------------------|
| `/api/polls`                        | GET    | Get polls list              | Query params: `page`, `limit`, `sort`  | `{ polls: Poll[], totalCount, pages }`   |
| `/api/polls`                        | POST   | Create new poll             | `{ question, options, settings }`      | `{ poll: Poll }`                         |
| `/api/polls/{id}`                   | GET    | Get poll by ID              | -                                      | `{ poll: Poll }`                         |
| `/api/polls/{id}`                   | PUT    | Update poll                 | `{ question, options, settings }`      | `{ poll: Poll }`                         |
| `/api/polls/{id}`                   | DELETE | Delete poll                 | -                                      | `{ success }`                            |
| `/api/polls/{id}/vote`              | POST   | Vote on poll                | `{ optionId }`                         | `{ poll: Poll }`                         |
| `/api/polls/{id}/crossref/{refId}`  | POST   | Cross-reference polls       | `{ relationship }`                     | `{ poll1: Poll, poll2: Poll }`           |
| `/api/polls/search`                 | GET    | Search polls                | Query params: `q`, `page`, `limit`     | `{ polls: Poll[], totalCount, pages }`   |

### Users API

| Endpoint                    | Method | Description                 | Request Body                           | Response                                 |
|-----------------------------|--------|-----------------------------|----------------------------------------|------------------------------------------|
| `/api/users/{id}`           | GET    | Get user profile            | -                                      | `{ user: User }`                         |
| `/api/users/{id}`           | PUT    | Update user profile         | `{ name, avatar, ... }`                | `{ user: User }`                         |
| `/api/users/{id}/polls`     | GET    | Get user's polls            | Query params: `page`, `limit`          | `{ polls: Poll[], totalCount, pages }`   |
| `/api/users/{id}/votes`     | GET    | Get user's voted polls      | Query params: `page`, `limit`          | `{ polls: Poll[], totalCount, pages }`   |

## Data Models

### Poll Model

```typescript
interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  crossReferences: CrossReference[];
  settings: {
    visibility: 'public' | 'private';
    allowMultipleVotes: boolean;
    expiresAt?: string;
    categories: string[];
    tags: string[];
  };
}

interface PollOption {
  id: string;
  text: string;
  votes: number; // Only returned when viewing results
}

interface CrossReference {
  pollId: string;
  question: string;
  relationship: string;
  createdAt: string;
  createdBy: User;
}
```

### User Model

```typescript
interface User {
  id: string;
  name: string;
  email: string; // Only included for current user
  avatar: string;
  createdAt: string;
  bio?: string;
  stats: {
    pollsCreated: number;
    pollsVoted: number;
  };
}
```

## Error Handling

Error handling follows a consistent pattern throughout the application:

1. API errors return proper HTTP status codes and error messages
2. Frontend catches errors and updates appropriate error state
3. Error notifications are displayed to the user
4. Critical errors are logged to monitoring service

```typescript
// Example error handling in an action
async function votePoll(pollId: string, optionId: string) {
  try {
    // Optimistic update
    updatePollState(pollId, optionId);
    
    const response = await fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote');
    }
    
    const data = await response.json();
    // Update with real data
    setPollData(data.poll);
  } catch (error) {
    // Revert optimistic update
    revertPollState(pollId);
    // Set error state
    setPollsError(error.message);
    // Show notification
    notifyError('Voting failed', error.message);
  }
}
```
