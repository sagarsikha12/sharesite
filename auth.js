// auth.js

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password",  type: "password" }
      },
      authorize: async (credentials) => {
        try {
          // Make a POST request to your Rails API to authenticate the user
          const res = await fetch('http://127.0.0.1:4000/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (res.ok && data.user) {
            // If authentication is successful, return the user object
            return Promise.resolve(data.user);
          } else {
            // If authentication fails, return null
            return Promise.resolve(null);
          }
        } catch (error) {
          // Handle any errors here
          console.error('Authentication error:', error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
})
