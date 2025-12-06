"use client";

import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet, useActiveAccount } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { PaymentCard } from "@/components/payment-card";
import { ContentDisplay } from "@/components/content-display";
import { TransactionLog, LogEntry } from "@/components/transaction-log";
import { Separator } from "@/components/ui/separator";
import { createNormalizedFetch } from "@/lib/payment";
import { AVALANCHE_FUJI_CHAIN_ID, PAYMENT_AMOUNTS, API_ENDPOINTS } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

interface ContentData {
  tier: string;
  data: string;
  features?: string[];
  timestamp: string;
}

export default function Home() {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [content, setContent] = useState<ContentData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    setLogs([]);
    setContent(null);
  }, [wallet, account?.address]);

  const addLog = (message: string, type: LogEntry["type"]) => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const updateLogStatus = (messagePattern: string, newType: LogEntry["type"]) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.message.includes(messagePattern) ? { ...log, type: newType } : log
      )
    );
  };

  const handlePayment = async (tier: "basic" | "premium") => {
    if (!wallet) return;

    setIsPaying(true);
    setContent(null);
    setLogs([]);

    try {
      addLog(`Initiating ${tier} payment...`, "info");

      const normalizedFetch = createNormalizedFetch(AVALANCHE_FUJI_CHAIN_ID);
      const fetchWithPay = wrapFetchWithPayment(
        normalizedFetch,
        client,
        wallet,
        tier === "basic" ? PAYMENT_AMOUNTS.BASIC.bigInt : PAYMENT_AMOUNTS.PREMIUM.bigInt
      );

      addLog("Requesting payment authorization...", "info");
      const response = await fetchWithPay(tier === "basic" ? API_ENDPOINTS.BASIC : API_ENDPOINTS.PREMIUM);
      const responseData = await response.json();

      if (response.status === 200) {
        updateLogStatus("Initiating", "success");
        updateLogStatus("Requesting payment authorization", "success");
        addLog("Payment successful!", "success");
        addLog("Content received", "success");
        setContent(responseData);
      } else {
        updateLogStatus("Initiating", "error");
        updateLogStatus("Requesting payment authorization", "error");
        const errorMsg = responseData.error || "Unknown error";
        addLog(`Payment failed: ${errorMsg}`, "error");
      }
    } catch (error) {
      updateLogStatus("Initiating", "error");
      updateLogStatus("Requesting payment authorization", "error");
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Error: ${errorMsg}`, "error");
    } finally {
      setIsPaying(false);
    }
  };

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-6 p-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">x402 Starter Kit</h1>
            <p className="text-muted-foreground">HTTP 402 Payment Protocol Demo</p>
            <p className="text-sm text-muted-foreground mt-1">Avalanche Fuji Testnet</p>
          </div>
          <ConnectButton client={client} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">x402 Payment Demo</h1>
          <p className="text-muted-foreground">Choose a payment tier to unlock content</p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <ConnectButton client={client} />
          </div>
        </div>

        <Separator />

        {/* FREE CONTENT SECTION - ALWAYS VISIBLE */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-green-700">Free Content - Always Available</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                This is free content that anyone can access without payment. This section demonstrates
                content that is NOT behind a paywall.
              </p>
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Free Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Basic information and previews</li>
                  <li>Public documentation</li>
                  <li>Community features</li>
                  <li>Sample data and examples</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> ✅ Unlocked - No payment required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PAYWALL SECTION - LOCKED CONTENT */}
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-lg shadow-lg p-6 border-2 ${content ? 'border-blue-500' : 'border-orange-500'}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 ${content ? 'bg-blue-500' : 'bg-orange-500'} rounded-full`}></div>
              <h2 className={`text-2xl font-bold ${content ? 'text-blue-700' : 'text-orange-700'}`}>
                {content ? 'Premium Content - Unlocked!' : 'Premium Content - Locked 🔒'}
              </h2>
            </div>

            {!content ? (
              <div className="space-y-4">
                <div className="bg-orange-50 p-6 rounded-md border border-orange-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-100/80 flex items-end justify-center pb-6">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🔒</div>
                      <p className="font-bold text-orange-900">Premium Content Locked</p>
                      <p className="text-sm text-orange-700">Make a payment to unlock</p>
                    </div>
                  </div>
                  <div className="blur-sm select-none pointer-events-none">
                    <h3 className="font-semibold mb-2">Premium Features:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Advanced analytics and insights</li>
                      <li>Exclusive content and tutorials</li>
                      <li>Priority support access</li>
                      <li>Premium API endpoints</li>
                      <li>Real-time data updates</li>
                      <li>Custom integrations</li>
                    </ul>
                    <div className="mt-4 p-3 bg-white rounded">
                      <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> 🔒 Locked - Payment required to unlock
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 text-blue-900">✨ Premium Features Unlocked:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Advanced analytics and insights</li>
                    <li>Exclusive content and tutorials</li>
                    <li>Priority support access</li>
                    <li>Premium API endpoints</li>
                    <li>Real-time data updates</li>
                    <li>Custom integrations</li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> ✅ Unlocked - Payment successful!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap justify-between gap-6 max-w-4xl mx-auto">
          <PaymentCard
            tier="Basic"
            price="$0.01"
            description="Perfect for trying out the payment system"
            onPayClick={() => handlePayment("basic")}
            isPaying={isPaying}
          />
          <PaymentCard
            tier="Premium"
            price="$0.15"
            description="Full access to all advanced features"
            onPayClick={() => handlePayment("premium")}
            isPaying={isPaying}
          />
        </div>

        {content && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ContentDisplay
              tier={content.tier}
              data={content.data}
              features={content.features}
              timestamp={content.timestamp}
            />
          </div>
        )}

        {logs.length > 0 && (
          <div className="max-w-4xl mx-auto animate-in fade-in-from-bottom-4 duration-700">
            <TransactionLog logs={logs} />
          </div>
        )}
      </div>
    </div>
  );
}
