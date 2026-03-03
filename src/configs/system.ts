export const systemConfig = {
  orchestration: {
    mode: "adaptive" as "adaptive" | "deterministic",
    maxIterations: 3,
    revenueFloor: 10000
  },
  checkout: {
    defaultCurrency: "usd",
    products: [
      { sku: "MANUS_OFFER", name: "MANUS Offer", amountCents: 4900 }
    ]
  }
};
