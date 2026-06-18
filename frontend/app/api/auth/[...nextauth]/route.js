import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';

const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_google_client_id_please_configure',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_google_secret_please_configure',
  }),
  AppleProvider({
    clientId: process.env.APPLE_ID || 'dummy_apple_id_please_configure',
    clientSecret: process.env.APPLE_SECRET || 'dummy_apple_secret_please_configure',
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Authentication failed');
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  }),
];

const handler = NextAuth({
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'apple') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              avatar: user.image,
              provider: account.provider,
            })
          });

          const data = await res.json();
          if (!res.ok) {
            return false;
          }
          // Attach db info to user object so jwt callback gets it
          user.id = data.id;
          user.role = data.role;
          user.avatar = data.avatar;
          return true;
        } catch (error) {
          console.error('OAuth sync error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
