import { db } from '@/lib/firebase'
import { resend } from '@/lib/resend'
import 'server-only'

import Stripe from 'stripe'

export async function handleStripeSubscription(
  event: Stripe.CheckoutSessionCompletedEvent,
) {
  if (event.data.object.payment_status === 'paid') {
    console.log(
      'Pagamento realizado com sucesso. Enviar um email e liberar acesso',
    )

    const metadata = event.data.object.metadata
    const userId = metadata?.userId
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email

    if (!userId || !userEmail) {
      console.error('User Id not found')
      return
    }

    await db.collection('users').doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: 'active',
    })

    const { data, error } = await resend.emails.send({
      from: 'Acme <vinicius26@gmail.com>',
      to: [userEmail],
      subject: 'Assinatura com sucesso',
      text: 'Assinatura com sucesso',
    })

    if (error) {
      console.error(error)
    }

    console.log(data)
  }
}
