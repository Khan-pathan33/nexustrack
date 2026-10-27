import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./user-store";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Built-in Demo & Admin accounts (works instantly even before DB seeding)
        if (
          (email === 'admin@trackpulse.com' ||
            email === 'admin@nexustrack.com' ||
            email === 'demo@trackpulse.com' ||
            email === 'nafisakhanampathan65@gmail.com') &&
          password === 'admin123'
        ) {
          return {
            id: 'admin-001',
            name: email.includes('nafisa') ? 'Nafisa Khanam' : 'Admin User',
            email: email,
            batch: '3',
            role: 'admin',
            emailUser: 'nafisakhanampathan65@gmail.com',
            excelFilename: 'Technical Team batch-3_Daily_Status_Report.xlsx',
            hasCompletedOnboarding: true,
          };
        }

        try {
          const user = await findUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return null;
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            batch: user.batch || '3',
            role: user.role || 'coordinator',
            emailUser: user.emailUser || user.email,
            excelFilename: user.excelFilename || `Technical Team batch-${user.batch || '3'}_Daily_Status_Report.xlsx`,
            sharepointUrl: user.sharepointUrl || '',
            tlEmail: user.tlEmail || '',
            hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding),
          };
        } catch (error) {
          console.error("Database authentication error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.batch = (user as any).batch || '3';
        token.role = (user as any).role || 'coordinator';
        token.emailUser = (user as any).emailUser || user.email;
        token.excelFilename = (user as any).excelFilename;
        token.sharepointUrl = (user as any).sharepointUrl;
        token.tlEmail = (user as any).tlEmail;
        token.hasCompletedOnboarding = (user as any).hasCompletedOnboarding;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).batch = (token.batch as string) || '3';
        (session.user as any).role = (token.role as string) || 'coordinator';
        (session.user as any).emailUser = (token.emailUser as string) || session.user.email;
        (session.user as any).excelFilename = token.excelFilename as string;
        (session.user as any).sharepointUrl = token.sharepointUrl as string;
        (session.user as any).tlEmail = token.tlEmail as string;
        (session.user as any).hasCompletedOnboarding = Boolean(token.hasCompletedOnboarding);
      }
      return session;
    }
  },
});
