"use client"

import { useState } from "react";
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,

  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";


const initialPlans = [
  {
    id: "free",
    name: "FREE",
    price: "0$",
    interval: "/month",
    features: [
      "5 PDF Upload",
      "Unlimited Chats",
      "Email support",
      "Help center access",
    ],
    isSelected: true,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "9.99$",
    interval: "/month",
    features: [
      "Unlimited PDF Upload",
      "Unlimited Chats",
      "Email support",
      "Help center access",
    ],
    isSelected: false,
  },
];

export default function Billing() {
  const [plans, setPlans] = useState(initialPlans);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useUser();
  const upgradePlan = useMutation(api.user.userUpgradePlan)

  const handleCardClick = (id: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => ({
        ...plan,
        isSelected: plan.id === id,
      }))
    );
  };

  const isUnlimitedSelected = plans.find(plan => plan.id === "unlimited")?.isSelected;

  const handlePayment = () => {
    setIsDialogOpen(true);
  };


  const onApprovePayment = async () => {
    const result = await upgradePlan({
      userEmail : user?.primaryEmailAddress?.emailAddress as string,

    })

    console.log(result)
  };
  

  return (
    <div className="p-6 h-[calc(80vh)]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-1">Billing</h1>
        <p className="text-sm text-gray-400 mb-6">
          Upgrade your plan to upload multiple pdf to chat with.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => handleCardClick(plan.id)}
              className={`bg-zinc-900 border-zinc-800 relative overflow-hidden cursor-pointer ${
                plan.isSelected ? "border-4 border-blue-500" : ""
              }`}
            >
              <CardHeader className="border-b border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-medium text-gray-400">
                    {plan.name}
                  </div>
                  {plan.isSelected && (
                    <div className="text-xs font-medium text-white px-2.5 py-1 rounded-full bg-zinc-800">
                      Selected
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.interval}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex gap-3 text-sm text-gray-300">
                      <Check className="h-5 w-5 text-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {isUnlimitedSelected && (
          <Button 
            onClick={handlePayment}
            className="w-full md:w-auto"
          >
            Proceed to Payment
          </Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Payment using PayPal </DialogTitle>
              <DialogDescription>
                PayPal is secure to use 
              </DialogDescription>
            </DialogHeader>
            <PayPalButtons
              onApprove={onApprovePayment}
              onCancel={()=>console.log("Payment cancelled")}
            createOrder={(data,actions)=>{
              return actions?.order?.create({
                intent: "CAPTURE",
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: "9.99",
                  },
                }],

              })
            }

            } />
            
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
