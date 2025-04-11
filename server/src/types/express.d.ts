// Type definitions for express with Passport

// Extend Express Request interface with Passport properties
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      logout(callback?: (err: Error | null) => void): void;
    }
  }
}
