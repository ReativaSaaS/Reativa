// ===== STRIPE CONFIGURATION =====
// Replace with your Stripe keys
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51TXnFnFqMSsyBLEJrgw2fx5Eq91tGGoE5b0s0xmmwggWkBwkalqfF1ptvktrSlrNDAio4tRFOvGcxHuSzF1xQ67R00wPFf2gj5";

// Price IDs from your Stripe dashboard
const STRIPE_PRICES = {
  starter: "price_1TXnzgPtCVDjmIv2RmQVt4B9",
  pro: "price_1TXo0BPtCVDjmIv25oH3TYG0",
  business: "price_1TXo0dPtCVDjmIv2OM4Duki0",
};

// Initialize Stripe
let stripe;
try {
  stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
} catch (e) {
  console.warn("[Stripe] Not configured yet");
}

// ===== CHECKOUT =====
async function createCheckoutSession(priceId) {
  const session = await window.ReativaAuth.checkSession();
  if (!session) {
    window.location.href = "/pages/login.html";
    return;
  }

  // In production, this would call your backend to create a Checkout Session
  // For now, redirect to Stripe Checkout directly
  try {
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      successUrl:
        window.location.origin + "/pages/dashboard.html?checkout=success",
      cancelUrl:
        window.location.origin + "/pages/pricing.html?checkout=cancelled",
      customerEmail: session.user.email,
    });

    if (error) throw error;
  } catch (error) {
    console.error("[Stripe] Checkout error:", error);
    showToast("Erro ao processar pagamento", "error");
  }
}

// ===== PLAN SELECTION =====
function selectPlan(plan) {
  const prices = { starter: 15, pro: 35, business: 60 };
  const price = prices[plan];

  // Check if user is logged in
  window.ReativaAuth.checkSession().then((session) => {
    if (!session) {
      // Save selected plan and redirect to register
      localStorage.setItem("selectedPlan", plan);
      window.location.href = "/pages/register.html";
      return;
    }

    // If we have real Stripe Price IDs, use them
    const priceId = STRIPE_PRICES[plan];
    if (priceId && priceId.startsWith("price_")) {
      createCheckoutSession(priceId);
    } else {
      // Demo mode - simulate checkout success
      showToast(
        `Plano ${plan.toUpperCase()} selecionado - R$${price}/mês`,
        "success",
      );
      setTimeout(() => {
        window.location.href =
          "/pages/dashboard.html?checkout=demo&plan=" + plan;
      }, 1500);
    }
  });
}

// ===== BILLING PORTAL =====
async function openBillingPortal() {
  try {
    // In production, call your backend to create a portal session
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: (await window.ReativaAuth.checkSession()).user.id,
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error("[Stripe] Portal error:", error);
    showToast("Erro ao abrir portal de cobrança", "error");
  }
}

// ===== EXPORTS =====
window.ReativaStripe = {
  createCheckoutSession,
  selectPlan,
  openBillingPortal,
  STRIPE_PRICES,
};
