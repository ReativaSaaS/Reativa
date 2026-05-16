import { checkSession } from './supabase'

const STRIPE_PUBLISHABLE_KEY = "pk_test_51TXnFnFqMSsyBLEJrgw2fx5Eq91tGGoE5b0s0xmmwggWkBwkalqfF1ptvktrSlrNDAio4tRFOvGcxHuSzF1xQ67R00wPFf2gj5"

const STRIPE_PRICES = {
  starter: "price_1TXnzgPtCVDjmIv2RmQVt4B9",
  pro: "price_1TXo0BPtCVDjmIv25oH3TYG0",
  business: "price_1TXo0dPtCVDjmIv2OM4Duki0",
}

let stripe = null

try {
  if (window.Stripe) {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY)
  }
} catch (e) {
  console.warn('[Stripe] Not configured yet')
}

export async function createCheckoutSession(priceId) {
  const session = await checkSession()
  if (!session) {
    window.location.href = '/login'
    return
  }

  if (!stripe) {
    console.error('Stripe not loaded')
    return
  }

  try {
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      successUrl: window.location.origin + "/dashboard?checkout=success",
      cancelUrl: window.location.origin + "/?checkout=cancelled",
      customerEmail: session.user.email,
    })

    if (error) throw error
  } catch (error) {
    console.error('[Stripe] Checkout error:', error)
    throw error
  }
}

export async function selectPlan(plan) {
  const prices = { starter: 15, pro: 35, business: 60 }
  const price = prices[plan]

  const session = await checkSession()
  if (!session) {
    localStorage.setItem('selectedPlan', plan)
    window.location.href = '/register'
    return
  }

  const priceId = STRIPE_PRICES[plan]
  if (priceId && priceId.startsWith('price_')) {
    await createCheckoutSession(priceId)
  } else {
    return { success: true, message: `Plano ${plan.toUpperCase()} selecionado - R$${price}/mês` }
  }
}

export async function openBillingPortal() {
  try {
    const session = await checkSession()
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    })

    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    console.error('[Stripe] Portal error:', error)
    throw error
  }
}
