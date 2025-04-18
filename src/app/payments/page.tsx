'use client'

import useMercadoPago from '@/hooks/useMercadoPago'
import useStripe from '@/hooks/useStripe'

export default function Payments() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe()

  const { createMercadoPagoCheckout } = useMercadoPago()

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() =>
          createPaymentStripeCheckout({
            testeId: '123',
          })
        }
      >
        Criar Pagamento Stripe
      </button>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() =>
          createSubscriptionStripeCheckout({
            testeId: '123',
          })
        }
      >
        Criar Assinatura Stripe
      </button>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() =>
          handleCreateStripePortal({
            testeId: '123',
          })
        }
      >
        Criar Portal de Pagamentos
      </button>

      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() =>
          createMercadoPagoCheckout({
            testeId: '123',
            userEmail: 'teste@gmail.com',
          })
        }
      >
        Criar Pagamento Mercado Pago
      </button>
    </div>
  )
}
