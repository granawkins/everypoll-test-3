# EveryPoll Routing Structure

This document outlines the routing structure for the EveryPoll application, defining the application routes and mapping them to corresponding components.

## Routing Library

For the EveryPoll application, we recommend using **React Router v6** for its:
- Declarative routing approach
- Nested routes capabilities
- Support for dynamic route parameters
- Route-based code splitting

## Route Structure

The application will use a hierarchical routing structure with the following main routes:

```
/                       # Home/Landing page
├── polls               # Poll feed (main application view)
│   ├── new             # Create new poll
│   ├── :pollId         # Individual poll view
│   └── search          # Search results
├── profile             
│   ├── :userId         # User profile
│   └── me              # Current user's profile
├── settings            # User settings
└── auth                # Authentication (lazy loaded)
    ├── login           # Login page
    └── signup          # Signup page
```

## Route Definitions

```typescript
// Example route definitions using React Router v6
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'polls',
        children: [
          { index: true, element: <PollFeed /> },
          { path: 'new', element: <CreatePollPage /> },
          { path: ':pollId', element: <PollDetailPage /> },
          { path: 'search', element: <SearchResultsPage /> },
        ],
      },
      {
        path: 'profile',
        children: [
          { path: ':userId', element: <ProfilePage /> },
          { path: 'me', element: <MyProfilePage /> },
        ],
      },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];
```

## Route to Component Mapping

| Route                | Component             | Authentication Required | Description                                      |
|----------------------|-----------------------|-------------------------|--------------------------------------------------|
| `/`                  | `HomePage`            | No                      | Landing page with featured polls                 |
| `/polls`             | `PollFeed`            | No                      | Main feed of polls with infinite scroll          |
| `/polls/new`         | `CreatePollPage`      | Yes                     | Form to create a new poll                        |
| `/polls/:pollId`     | `PollDetailPage`      | No                      | Detailed view of a single poll                   |
| `/polls/search`      | `SearchResultsPage`   | No                      | Search results with filters                      |
| `/profile/:userId`   | `ProfilePage`         | No                      | Public profile view for any user                 |
| `/profile/me`        | `MyProfilePage`       | Yes                     | Current user's profile with private options      |
| `/settings`          | `SettingsPage`        | Yes                     | User account settings                            |
| `/auth/login`        | `LoginPage`           | No (logged out only)    | User login page                                  |
| `/auth/signup`       | `SignupPage`          | No (logged out only)    | User registration page                           |
| `*` (not found)      | `NotFoundPage`        | No                      | 404 error page                                   |

## Route Guards and Protection

To protect routes that require authentication:

```typescript
// Example implementation of a protected route
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

// Usage
<Route 
  path="/polls/new" 
  element={
    <ProtectedRoute>
      <CreatePollPage />
    </ProtectedRoute>
  } 
/>
```

## Lazy Loading Routes

For performance optimization, we'll implement code splitting with lazy loading:

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded components
const CreatePollPage = lazy(() => import('./pages/CreatePollPage'));
const PollDetailPage = lazy(() => import('./pages/PollDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Routes with suspense fallbacks
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/polls" element={<PollFeed />} />
      <Route 
        path="/polls/new" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <CreatePollPage />
          </Suspense>
        } 
      />
      {/* Other routes... */}
    </Routes>
  );
}
```

## Route Parameters and Queries

The application will make use of both route parameters and query parameters:

### Route Parameters

- `:pollId` - Used to identify a specific poll
- `:userId` - Used to identify a specific user profile

### Query Parameters

- `?page=<number>` - Pagination for feeds and lists
- `?sort=<recent|popular|controversial>` - Sorting options
- `?category=<string>` - Category filtering
- `?q=<string>` - Search query term
- `?returnTo=<url>` - Redirect URL after login

## Navigation and Link Generation

For consistent navigation throughout the application:

```typescript
// Example of a navigation helper
function useNavigation() {
  const navigate = useNavigate();
  
  return {
    goToHome: () => navigate('/'),
    goToPollDetail: (pollId: string) => navigate(`/polls/${pollId}`),
    goToUserProfile: (userId: string) => navigate(`/profile/${userId}`),
    goToCreatePoll: () => navigate('/polls/new'),
    goToSearch: (query: string) => navigate(`/polls/search?q=${encodeURIComponent(query)}`),
    goBack: () => navigate(-1),
  };
}
```

## URL Sharing and Deep Linking

The application will support deep linking to specific states:

- Sharing a poll: `/polls/:pollId`
- Sharing a user profile: `/profile/:userId`
- Sharing search results: `/polls/search?q=<search term>`
- Sharing filtered views: `/polls?category=<category>&sort=<sort option>`

## Handling Route Transitions

The application will implement smooth transitions between routes:

```typescript
// Example route transition component
function RouteTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Route-based Analytics

Each route change will trigger analytics events to track user navigation patterns:

```typescript
function RouteAnalytics() {
  const location = useLocation();
  
  useEffect(() => {
    // Example analytics call
    analytics.pageView({
      path: location.pathname,
      title: document.title,
      search: location.search,
    });
  }, [location]);
  
  return null;
}
```

## Error Boundaries for Routes

Each major route will be wrapped in an error boundary to prevent entire app crashes:

```typescript
// Sample implementation
function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<ErrorPage />}
      onError={(error) => {
        // Log route errors to monitoring service
        errorMonitoring.captureException(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```
