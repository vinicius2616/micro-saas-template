import { FirestoreAdapter } from '@auth/firebase-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { firebaseCert } from './firebase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
})
