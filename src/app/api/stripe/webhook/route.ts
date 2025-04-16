import stripe from '@/lib/stripe'
import { handleStripeCancelSubscription } from '@/server/stripe/handle-cancel'
import { handleStripePayment } from '@/server/stripe/handle-payment'
import { handleStripeSubscription } from '@/server/stripe/handle-subscription'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secret = process.env.STRIP_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature || !secret) {
      return NextResponse.json(
        { error: 'No signature or secret' },
        { status: 400 },
      )
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed': // Pagamento realizado status = paid
        const metadata = event.data.object.metadata

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event)
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event)
        }

        break
      case 'checkout.session.expired': // expirou o tempo de pagamento
        break
      case 'checkout.session.async_payment_succeeded': // Boleto pago
        break
      case 'checkout.session.async_payment_failed': // Boleto falhou
        break
      case 'customer.subscription.created': // Criou a assinatura
        break
      case 'customer.subscription.updated': //  Atualizou a assinatura
        break
      case 'customer.subscription.deleted': // Cancelou a assinatura
        await handleStripeCancelSubscription(event)
        break

      default:
        console.log('Event type:', event.type)
        break
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
  } catch (error) {
    console.log('error webhook', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
