# EveryPoll Component Diagram

This document provides visual diagrams illustrating the component relationships, data flow, and architecture of the EveryPoll application.

## Component Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                  App                                     │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    │
              ┌────────────────────┴─────────────────────┐
              │                                          │
              ▼                                          ▼
┌─────────────────────────────┐            ┌────────────────────────────┐
│          Layout             │            │       Auth Routes           │
│  ┌─────────────────────┐   │            │  (LoginPage, SignupPage)    │
│  │      Header         │   │            └────────────────────────────┘
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │      Content        │   │
│  └──────────┬──────────┘   │
│             │              │
│  ┌─────────────────────┐   │
│  │      Footer         │   │
│  └─────────────────────┘   │
└─────────────┬───────────────┘
              │
              │
┌─────────────▼───────────────┐
│         Route Content        │
└─────────────┬───────────────┘
              │
              ▼
    ┌─────────────────────┐
    │       Pages         │
    └─────────┬───────────┘
              │
  ┌───────────┴────────────┐
  │                        │
  ▼                        ▼
┌────────────┐    ┌────────────────┐    
│  HomePage  │    │  PollFeed      │    ┌─────────────────┐
└─────┬──────┘    └───────┬────────┘    │                 │
      │                   │             │                 ▼
      │                   │        ┌────────────┐  ┌────────────────┐
      │                   └───────►│  PollCard  │  │ CreatePollPage │
      │                   │        └─────┬──────┘  └────────────────┘
      └───────────────────┘              │
                                         │
                               ┌─────────┴──────────┐
                               │                    │
                               ▼                    ▼
                        ┌────────────┐      ┌────────────────┐
                        │PollQuestion│      │   PollOptions  │
                        └────────────┘      └────────────────┘
```

## Data Flow Diagram

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

## State Management Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Global Application State                      │
│                                                                      │
│  ┌────────────────┐   ┌────────────────┐   ┌────────────────────┐   │
│  │                │   │                │   │                    │   │
│  │  AuthContext   │   │  PollsContext  │   │    UIContext       │   │
│  │                │   │                │   │                    │   │
│  └────────────────┘   └────────────────┘   └────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

            │                  │                   │
            ▼                  ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ Authentication  │  │ Poll Data       │  │ UI State            │
│ Components      │  │ Components      │  │ Components          │
│                 │  │                 │  │                     │
│ - LoginModal    │  │ - PollCard      │  │ - Modal             │
│ - SignupModal   │  │ - PollFeed      │  │ - Navigation        │
│ - UserMenu      │  │ - PollDetail    │  │ - Notifications     │
└─────────────────┘  └─────────────────┘  └─────────────────────┘

            │                  │                   │
            ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Component Local State                         │
│                                                                      │
│  ┌────────────────┐   ┌────────────────┐   ┌────────────────────┐   │
│  │ Form Inputs    │   │ UI Interactions│   │ Component-specific │   │
│  │ & Validation   │   │ (hover, expand)│   │ data (temp)        │   │
│  └────────────────┘   └────────────────┘   └────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Route Structure Diagram

```
/
├── Home Page (/polls)
│   └── PollFeed Component
│       └── PollCard Components
│
├── Poll Detail (/polls/:pollId)
│   ├── PollDetail Component
│   └── RelatedPolls Component
│
├── Create Poll (/polls/new) [Protected]
│   └── PollCreationForm Component
│
├── Search Results (/polls/search)
│   └── SearchResultsList Component
│
├── User Profile (/profile/:userId)
│   ├── UserInfo Component
│   └── UserPollsList Component
│
├── My Profile (/profile/me) [Protected]
│   ├── UserInfo Component (editable)
│   └── UserPollsList Component
│
├── Settings (/settings) [Protected]
│   └── Settings Components
│
└── Authentication
    ├── Login (/auth/login)
    └── Signup (/auth/signup)
```

## Component Lifecycle and Interaction

```
┌─────────────┐     renders     ┌─────────────┐
│ Parent      │────────────────►│ Child       │
│ Component   │                 │ Component   │
└─────┬───────┘                 └─────┬───────┘
      │                               │
      │ provides props                │
      ▼                               │
┌─────────────┐                       │
│ Child Props │                       │
└─────────────┘                       │
                                      │
┌─────────────┐     bubbles up        │
│ Parent      │◄────────────────────┬─┘
│ Handlers    │     events           
└─────────────┘                      
```

## PollCard Component Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│ PollCard Component                                                   │
│                                                                      │
│  ┌─────────────────┐                                                 │
│  │ Unvoted State   │                                                 │
│  │                 │                                                 │
│  │ - Show question │  User votes   ┌─────────────────┐              │
│  │ - Show options  │──────────────►│ Voted State     │              │
│  │ - Show metadata │               │                 │              │
│  └─────────────────┘               │ - Show results  │              │
│                                    │ - Show charts   │              │
│                                    │ - Show user vote│              │
│                                    └────────┬────────┘              │
│                                             │                        │
│                       User cross-references │                        │
│                                             ▼                        │
│                                    ┌─────────────────┐              │
│                                    │ Cross-Referenced│              │
│                                    │ State          │              │
│                                    │                 │              │
│                                    │ - Show related  │              │
│                                    │   poll links    │              │
│                                    └─────────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

This visual representation should help clarify the component relationships, data flow, and general architecture of the EveryPoll application. When implementing the actual components, refer to the more detailed documentation in the other architecture files.
