# EveryPoll State Management Strategy

This document outlines the state management approach for the EveryPoll application, including what state management solution to use, what state should be global versus local, and how data fetching and caching will work.

## State Management Solution

For the EveryPoll application, we recommend using **React Context API with Reducers** for global state management, with the potential to introduce a more robust solution like Redux Toolkit if complexity increases significantly during development.

### Rationale:

1. **React Context + Reducers**
   - Provides a built-in solution without additional dependencies
   - Sufficiently powerful for our application's needs
   - Familiar pattern for most React developers
   - Easy to refactor or extend if needs change

2. **Why not Redux immediately?**
   - Adds additional learning curve and boilerplate
   - May be overkill for initial application needs
   - Can be integrated later if complexity demands it

## State Categories

The application state can be divided into several distinct categories:

### 1. Authentication State (Global)

Managed through a dedicated `AuthContext` that provides:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContext {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}
```

### 2. Poll Data State (Global with local caching)

Managed through a `PollsContext` that handles:

```typescript
interface PollsState {
  polls: {
    byId: Record<string, Poll>;
    allIds: string[];
  };
  userVotes: Record<string, string>; // pollId -> optionId
  filters: PollFilters;
  loading: boolean;
  error: string | null;
}

interface PollsContext {
  state: PollsState;
  getPolls: (filters?: PollFilters) => Promise<Poll[]>;
  getPollById: (id: string) => Promise<Poll>;
  createPoll: (data: PollCreateData) => Promise<Poll>;
  votePoll: (pollId: string, optionId: string) => Promise<void>;
  crossReferencePolls: (poll1Id: string, poll2Id: string) => Promise<void>;
}
```

### 3. UI State (Mix of global and local)

#### Global UI State

Managed through a `UIContext`:

```typescript
interface UIState {
  currentModal: string | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
  menuOpen: boolean;
}

interface UIContext {
  state: UIState;
  openModal: (modalId: string, props?: object) => void;
  closeModal: () => void;
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
  toggleTheme: () => void;
  toggleMenu: () => void;
}
```

#### Local UI State

Component-specific state managed within components:

- Form inputs and validation
- Expansion/collapse states
- Hover/focus states
- Local loading states

## Data Fetching and Caching Strategy

### 1. React Query Integration

We recommend using [React Query](https://react-query.tanstack.com/) to handle data fetching, caching, and synchronization:

```typescript
// Example usage with React Query
const { data: polls, isLoading, error } = useQuery(
  ['polls', filters],
  () => fetchPolls(filters),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  }
);
```

Benefits:
- Automatic caching
- Background refetching
- Pagination support
- Optimistic updates
- Easy invalidation of queries

### 2. Local Storage Persistence

For certain data, we'll implement local storage persistence:

```typescript
// Example localStorage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

Data to persist:
- Authentication tokens
- User preferences
- Recent searches
- Drafted polls (unsaved)

### 3. Data Synchronization

For real-time updates, we'll consider two approaches:

1. **Polling** (simpler, initial implementation):
   - Regular refetching of data at intervals
   - Works well for data that doesn't change frequently

2. **WebSockets** (more complex, for future implementation):
   - Real-time updates for vote counts and new polls
   - Essential for live poll experiences

## State Management Patterns

### 1. Container/Presenter Pattern

Separate data management from presentation:

```
└── PollFeedContainer
    ├── (Manages data fetching, filtering, pagination)
    └── PollFeed (Presentation component)
        └── PollCards
```

### 2. State Colocation

Keep state as close as possible to where it's used:

```typescript
// Example of colocated state in a component
function PollOptionsForm() {
  // This state is only needed within this component
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);

  // Logic for managing options...
}
```

### 3. Derived State

Compute derived values instead of storing them in state:

```typescript
// Example of derived state
function PollResults({ options, votes }) {
  // Derived state - calculated from props
  const totalVotes = useMemo(() => 
    votes.length, 
    [votes]
  );
  
  const percentages = useMemo(() => 
    options.map(option => ({
      ...option,
      percentage: totalVotes ? (option.votes / totalVotes) * 100 : 0
    })),
    [options, totalVotes]
  );
  
  // Render with derived data...
}
```

## Performance Considerations

1. **State Normalization**
   - Store data in normalized form (especially for polls and users)
   - Avoid duplication and inconsistencies

2. **Memoization**
   - Use `useMemo` and `useCallback` for expensive calculations or callbacks
   - Prevent unnecessary re-renders

3. **Context Splitting**
   - Split contexts by domain rather than having one large context
   - Prevents unnecessary re-renders when unrelated state changes

4. **Selector Pattern**
   - Use selectors to extract only the needed state from context
   - Reduces re-renders by selecting minimal state
