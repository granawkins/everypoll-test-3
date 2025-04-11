import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './database';
import { User as PrismaUser } from '@prisma/client';

// Declare type augmentation for passport
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends PrismaUser {}
  }
}

export default function configurePassport() {
  // Serialize and deserialize user for sessions
  // Use type any to avoid conflicts between Passport and Prisma types
  passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done: any) => {
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
      async (accessToken, refreshToken, profile, done) => {
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
          return done(error as Error, undefined);
        }
      }
    )
  );

  return passport;
}
