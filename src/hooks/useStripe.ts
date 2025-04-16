import { loadStripe, Stripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'

export default function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null)

  async function loadStripeAsync() {
    const stripeInstance = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!,
    )

    setStripe(stripeInstance)
  }

  async function createPaymentStripeCheckout(checkoutData: any) {
    if (!stripe) return

    try {
      const response = await fetch('/api/stripe/create-payment-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.log('error checkout', error)
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: any) {
    if (!stripe) return

    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.log('error subscription', error)
    }
  }

  async function handleCreateStripePortal(checkoutData: any) {
    if (!stripe) return

    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      window.location.href = data.url
    } catch (error) {
      console.log('error subscription', error)
    }
  }

  useEffect(() => {
    loadStripeAsync()
  }, [])

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  }
}
