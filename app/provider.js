"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const Provider = ({ children }) => {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT }}
    >
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </PayPalScriptProvider>
  );
};

export default Provider;
