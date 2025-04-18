import { resend } from '@/lib/resend'
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata
  const userEmail = metadata.user_email
  const testeId = metadata.teste_id
  console.log('PAGAMENTO COM SUCESSO', { userEmail, testeId, paymentData })

  const { data, error } = await resend.emails.send({
    from: 'Acme <me@andreelias.dev>',
    to: [userEmail],
    subject: 'Pagamento realizado com sucesso',
    text: 'Pagamento realizado com sucesso',
  })

  if (error) {
    console.error(error)
  }

  console.log(data)
}
