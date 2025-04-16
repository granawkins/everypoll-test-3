# EveryPoll Changelog

This file tracks the progress and changes made to transform the JavaScript template into the EveryPoll application.

## Initial Setup - April 11, 2025

- Created project roadmap
- Added changelog to track progress
- Created database schema for users, polls, votes, and cross-references in Prisma

## Dependencies Configuration - April 14, 2025

- Installed and configured frontend dependencies:
  - Material-UI components and theme
  - Redux Toolkit with auth and polls slices
  - React Query for data fetching
  - React Hook Form for form management
  - Recharts for poll visualization
  - Utilities: date-fns, lodash
- Installed and configured backend dependencies:
  - Express middleware with security enhancements
  - Passport.js with Google OAuth structure
  - Session management with PostgreSQL storage
  - Validation with Zod
  - Security packages: helmet, bcrypt, JWT
- Added environment variable templates
- Enhanced TypeScript configuration for better type safety
- Set up initial authentication routes
