# EveryPoll Core Components

This document provides detailed descriptions of the core components that make up the EveryPoll application interface.

## PollCard Component

The PollCard is the atomic unit of the EveryPoll application. It displays individual polls, allows users to vote, shows results, and provides options for cross-referencing.

### States

1. **Unvoted State**
   - Displays poll question
   - Shows voting options as buttons
   - Shows vote count but not detailed results
   - Creator information and timestamp visible

2. **Voted State**
   - Shows user's selected option highlighted
   - Displays full results with percentages and vote counts
   - Shows results chart visualization
   - Options are disabled for further voting
   - Allows undoing vote (if within time limit)

3. **Cross-referenced State**
   - Visual indicator showing it's cross-referenced
   - Link to related polls
   - Additional metadata about relationship

### Subcomponents

1. **PollQuestion**
   - Displays the poll question text
   - Handles text overflow for long questions
   - Optional image attachment display

2. **PollOptions**
   - List of selectable options
   - Handles various input types (single choice, multiple choice)
   - Shows vote counts and percentages when applicable
   - Visualizes user's own selection

3. **ResultsChart**
   - Bar or pie chart visualization of results
   - Color-coded by option
   - Animates when transitioning to voted state
   - Responsive to different screen sizes

4. **PollActions**
   - Share button with social media options
   - Cross-reference button to link to other polls
   - Report/flag inappropriate content
   - Bookmark/save functionality

5. **PollMetadata**
   - Creator information and avatar
   - Creation timestamp
   - Category/tags
   - View count
   - Comment count (if applicable)

### Props Interface

```typescript
interface PollCardProps {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    count: number;
  }>;
  totalVotes: number;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  userVote?: string | null; // Option ID user voted for, or null
  crossReferences?: Array<{
    id: string;
    question: string;
  }>;
  isExpanded?: boolean;
  onVote: (optionId: string) => void;
  onShare: () => void;
  onCrossReference: () => void;
}
```

## PollFeed Component

The PollFeed component displays a scrollable list of polls with infinite scrolling capability.

### Features

1. **Infinite Scrolling**
   - Loads additional polls as user scrolls down
   - Maintains scroll position when new items are loaded
   - Shows loading indicator while fetching

2. **Filtering and Sorting**
   - Filters by category, popularity, recency
   - Toggle between different view modes (compact/expanded)
   - Search functionality within feed

3. **Optimizations**
   - Virtualized list to handle large numbers of polls
   - Lazy loading of images
   - Debounced scroll events

### Props Interface

```typescript
interface PollFeedProps {
  initialPolls: PollType[];
  fetchMore: (offset: number, limit: number) => Promise<PollType[]>;
  isLoading?: boolean;
  filters?: {
    category?: string;
    sortBy?: 'recent' | 'popular' | 'controversial';
    search?: string;
  };
  onFilterChange?: (filters: object) => void;
}
```

## Navigation Components

### Header Component

The Header contains the main navigation elements, logo, and user menu.

#### Features
- Sticky positioning
- Responsive design (collapses to hamburger menu on mobile)
- Search functionality
- User authentication state display

### UserMenu Component

Dropdown menu for authenticated users with profile and account options.

#### Features
- Profile link
- Settings
- Notifications indicator
- Logout option
- Create poll button

## Authentication Components

### LoginModal Component

Modal dialog for user login.

#### Features
- Email/password login form
- Google OAuth button
- Form validation
- Error handling
- Link to signup
- Remember me option

### SignupModal Component

Modal dialog for new user registration.

#### Features
- Registration form with validation
- Terms and conditions acceptance
- Email verification flow
- Google OAuth registration option

## Poll Creation Form Component

Interactive form for creating new polls.

### Features

1. **Question Input**
   - Text input with character counter
   - Support for formatting options
   - Optional image upload

2. **Options Management**
   - Dynamic addition/removal of options
   - Drag-and-drop reordering
   - Character limits per option

3. **Settings**
   - Poll duration
   - Visibility options (public/private)
   - Category selection
   - Tags input

4. **Preview**
   - Live preview of how poll will appear
   - Mobile/desktop toggle for preview

### Props Interface

```typescript
interface PollCreationFormProps {
  onSubmit: (pollData: PollCreateData) => Promise<void>;
  categories: string[];
  isSubmitting?: boolean;
  initialData?: Partial<PollCreateData>;
  onCancel?: () => void;
}
```

## Cross-Reference Search Component

Search interface for finding and linking related polls.

### Features

1. **Search Input**
   - Autocomplete suggestions
   - Recent searches
   - Filter by category/tag

2. **Search Results**
   - Compact poll card display
   - Relevance highlighting
   - Quick select/link functionality

3. **Connection Explanation**
   - UI for explaining relationship between polls
   - Bidirectional reference options
