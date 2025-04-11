import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import prisma from './database';

// Define a UserType that's compatible with both Express and Prisma
type UserType = {
  id: string;
  email: string;
  name?: string | null;
  profileImage?: string | null;
  googleId?: string | null;
};

// Define type for the done callback used in passport strategies
type VerifyCallback = (error: Error | null, user?: any, info?: any) => void;

// Add passport-express.d.ts in your types directory if needed for a long-term solution

export default function configurePassport() {
  // Serialize and deserialize user for sessions
  passport.serializeUser<string>((user, done) => {
    // The user object comes from our strategy's verify callback
    const userObj = user as UserType;
    done(null, userObj.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      },
      async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
          // Find or create user
          const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: {},
            create: {
              email: profile.emails?.[0]?.value || '',
              name: profile.displayName,
              profileImage: profile.photos?.[0]?.value,
              googleId: profile.id,
            },
          });
          
          return done(null, user);
        } catch (error) {
          // Type cast error to something safer than any
          const err = error instanceof Error ? error : new Error('Unknown error during authentication');
          return done(err, undefined);
        }
      }
    )
  );

  return passport;
}
