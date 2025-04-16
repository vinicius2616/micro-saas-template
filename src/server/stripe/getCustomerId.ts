import { db } from '@/lib/firebase'
import stripe from '@/lib/stripe'
import 'server-only'

export async function getOrCreateCustomer(userId: string, userEmail: string) {
  try {
    const userRef = db.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      throw new Error('User not found')
    }

    const stripeCustomerId = userDoc.data()?.stripeCustomerId

    if (stripeCustomerId) {
      return stripeCustomerId
    }

    const userName = userDoc.data()?.name

    const stripeCustomer = await stripe.customers.create({
      email: userEmail,
      ...(userName && { name: userName }),
      metadata: {
        userId,
      },
    })

    await userRef.update({
      stripeCustomerId: stripeCustomer.id,
    })

    return stripeCustomer.id
  } catch (error) {
    throw new Error('Failed to get or create customer')
  }
}
