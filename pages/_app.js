// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '../context/UserContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
