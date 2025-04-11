# EveryPoll Component Hierarchy

This document outlines the component hierarchy and organization for the EveryPoll application. Components are organized by feature/functionality with clear parent-child relationships.

## Component Organization

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   │       ├── ProfileLink
│   │       ├── NotificationsMenu
│   │       └── AuthButtons
│   └── Footer
├── Pages
│   ├── HomePage
│   │   └── PollFeed
│   ├── PollDetailPage
│   │   ├── PollDetail
│   │   └── RelatedPolls
│   ├── CreatePollPage
│   │   └── PollCreationForm
│   ├── ProfilePage
│   │   ├── UserInfo
│   │   └── UserPollsList
│   └── SearchResultsPage
│       └── SearchResultsList
└── Components
    ├── PollCard
    │   ├── PollQuestion
    │   ├── PollOptions
    │   ├── VoteButton
    │   ├── ResultsChart
    │   ├── PollActions
    │   │   ├── ShareButton
    │   │   ├── CrossReferenceButton
    │   │   └── ReportButton
    │   └── PollMetadata
    ├── PollFeed
    │   └── InfiniteScroll
    ├── Auth
    │   ├── LoginModal
    │   ├── SignupModal
    │   └── GoogleAuthButton
    ├── CrossReferenceSearch
    │   ├── SearchInput
    │   └── SearchResults
    └── Common
        ├── Button
        ├── Input
        ├── Modal
        ├── LoadingSpinner
        ├── ErrorMessage
        └── EmptyState
```

## Component Organization by Feature

### Core Poll Features
- **PollCard**: The atomic unit of the application
- **PollFeed**: Container for displaying multiple polls with infinite scroll
- **PollDetail**: Expanded view of a poll with additional information
- **PollCreationForm**: Form for creating new polls

### Authentication
- **LoginModal**: Modal for user login
- **SignupModal**: Modal for user registration
- **GoogleAuthButton**: Button for Google OAuth authentication
- **UserMenu**: Dropdown menu for authenticated users

### Navigation
- **Header**: Main navigation container
- **Navigation**: Navigation links
- **Footer**: Application footer with additional links

### User Profile
- **ProfilePage**: User profile page
- **UserInfo**: User information display
- **UserPollsList**: List of polls created by the user

### Search & Cross-Reference
- **SearchResultsPage**: Page displaying search results
- **CrossReferenceSearch**: Search component for cross-referencing polls
- **RelatedPolls**: Display of related/cross-referenced polls

### Common UI Components
- **Button**: Reusable button component
- **Input**: Reusable input component
- **Modal**: Reusable modal component
- **LoadingSpinner**: Loading indicator
- **ErrorMessage**: Error display component
- **EmptyState**: Empty state display

## Parent-Child Relationships

Each parent component is responsible for:
1. Providing necessary props to child components
2. Managing state relevant to its children
3. Handling events bubbled up from children

Child components should:
1. Be focused on a single responsibility
2. Bubble up events to parent components
3. Minimize direct API calls (defer to container components)

This hierarchy promotes component reusability, maintainability, and follows the principle of separation of concerns.
