import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';  // Adjust the path according to your folder structure

const MAX_RETRIES = 3;

async function retrySignInWithCredential(credential, retries = 0) {
  try {
    await signInWithCredential(auth, credential);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying signInWithCredential: Attempt ${retries + 1}`);
      await retrySignInWithCredential(credential, retries + 1);
    } else {
      throw error;
    }
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 20000, // 20 seconds
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000, // Set the timeout to 10 seconds
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error('Please enter an email and password');
        }
        
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const user = userCredential.user;
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
          };
        } catch (error) {
          console.error('CredentialsProvider error:', error);
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log('Account:', account);
      console.log('Profile:', profile);

      if (account.provider === 'google') {
        const credential = GoogleAuthProvider.credential(account.id_token);
        try {
          await retrySignInWithCredential(credential);
          return true;
        } catch (error) {
          console.error('Firebase signInWithCredential error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log('SignIn Event:', message);
    },
    async error(message) {
      console.error('NextAuth Error:', message);
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/register',
  },
  debug: true,
});
