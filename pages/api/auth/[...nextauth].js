import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        const idToken = account.id_token;
        if (!idToken) {
          console.error('ID Token not found');
          return false;
        }
        const credential = GoogleAuthProvider.credential(idToken);
        try {
          const result = await signInWithCredential(auth, credential);
          // You might want to do something with the result here
          return true;
        } catch (error) {
          console.error('Firebase signInWithCredential error:', error);
          // Consider more robust error handling here
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id; // This might need to be adjusted to use Firebase UID
        token.email = user.email;
        // Add any additional account info you need
        // token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      // Add any additional user info you need in the session
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to /study after login
      // Consider adding logic here if you need conditional redirects
      return `${baseUrl}/study`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: null,
  },
});