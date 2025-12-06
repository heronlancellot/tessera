"use client";

import { useState } from "react";
import { Lock, Unlock, CreditCard, Shield, Zap, Crown } from "lucide-react";

export default function PremiumContentExample() {
  const [isPremium, setIsPremium] = useState(false);

  const handleUnlock = () => {
    // Simula desbloqueio - em produção, isso seria um pagamento real
    setIsPremium(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className={`inline-flex items-center gap-2 ${isPremium ? 'bg-blue-600' : 'bg-orange-600'} text-white px-4 py-2 rounded-full`}>
            <span className="text-2xl">{isPremium ? '✨' : '🔒'}</span>
            <span className="font-semibold">{isPremium ? 'PREMIUM UNLOCKED' : 'PREMIUM REQUIRED'}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Premium Content Page</h1>
          <p className="text-gray-600">
            {isPremium
              ? 'You have full access to all premium features!'
              : 'This page contains premium content protected by a paywall'}
          </p>
        </div>

        {/* Preview Section - Always Visible */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-green-700">Free Preview</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              This is a free preview section that's always visible. It gives users a taste of what
              they'll get with premium access.
            </p>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="font-semibold mb-2">What you'll get with Premium:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Advanced analytics and insights</li>
                <li>Exclusive tutorials and guides</li>
                <li>Priority customer support</li>
                <li>API access with higher rate limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paywall Section */}
        {!isPremium ? (
          <>
            {/* Locked Content with Blur Effect */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-500 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-orange-700" />
                <h2 className="text-2xl font-bold text-orange-700">Premium Content - Locked</h2>
              </div>

              {/* Blurred Content */}
              <div className="relative">
                <div className="blur-sm select-none pointer-events-none space-y-4 text-gray-700">
                  <p>
                    This is exclusive premium content that contains advanced insights and detailed
                    analysis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Detailed Analytics:</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Revenue Growth</p>
                        <p className="text-2xl font-bold">+234%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold">12.5%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold">45,892</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Retention</p>
                        <p className="text-2xl font-bold">87%</p>
                      </div>
                    </div>
                  </div>
                  <p>
                    More exclusive content here with detailed explanations and insights that only
                    premium members can access...
                  </p>
                </div>

                {/* Overlay with Unlock Button */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/60 to-orange-100/90 flex items-center justify-center">
                  <div className="text-center bg-white p-8 rounded-lg shadow-xl border-2 border-orange-500 max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Premium Content</h3>
                    <p className="text-gray-600 mb-6">
                      Unlock this content to access exclusive insights, advanced analytics, and premium features
                    </p>
                    <button
                      onClick={handleUnlock}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 mx-auto"
                    >
                      <CreditCard className="w-5 h-5" />
                      Unlock for $0.15
                    </button>
                    <p className="text-xs text-gray-500 mt-3">One-time payment • Instant access</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-500">
              <h2 className="text-2xl font-bold text-orange-700 mb-4">Why Go Premium?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: "Priority Support", desc: "Get help when you need it" },
                  { icon: Zap, title: "Advanced Features", desc: "Access to all premium tools" },
                  { icon: Crown, title: "Exclusive Content", desc: "Members-only tutorials" },
                  { icon: CreditCard, title: "API Access", desc: "Higher rate limits" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-md">
                    <benefit.icon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Unlocked Premium Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
              <div className="flex items-center gap-2 mb-4">
                <Unlock className="w-5 h-5 text-blue-700" />
                <h2 className="text-2xl font-bold text-blue-700">Premium Content - Unlocked!</h2>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="flex items-center gap-2 text-blue-900 font-semibold">
                    <span className="text-xl">✨</span>
                    Welcome to Premium! You now have full access.
                  </p>
                </div>

                <p>
                  This is exclusive premium content that contains advanced insights and detailed
                  analysis. Now you can see everything clearly without any restrictions!
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-md">
                  <h3 className="font-semibold mb-4 text-blue-900">Detailed Analytics:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Revenue Growth</p>
                      <p className="text-3xl font-bold text-blue-600">+234%</p>
                      <p className="text-xs text-gray-500 mt-1">↑ 15% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-3xl font-bold text-blue-600">12.5%</p>
                      <p className="text-xs text-gray-500 mt-1">↑ 2.3% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-blue-600">45,892</p>
                      <p className="text-xs text-gray-500 mt-1">↑ 8,234 new this month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600">Retention Rate</p>
                      <p className="text-3xl font-bold text-blue-600">87%</p>
                      <p className="text-xs text-gray-500 mt-1">↑ 5% from last month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-blue-900">Exclusive Insights:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">▶</span>
                      <span>User engagement peaks between 2-4 PM on weekdays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">▶</span>
                      <span>Mobile users show 23% higher conversion rates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">▶</span>
                      <span>Premium features drive 67% of customer retention</span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-600 italic">
                  This is an example of exclusive premium content. In a real application, this would
                  contain valuable insights, detailed tutorials, or advanced features that justify
                  the payment.
                </p>
              </div>
            </div>

            {/* Premium Features Unlocked */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">✨ Your Premium Features</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Advanced Analytics Dashboard",
                  "Priority Email Support",
                  "API Access (10,000 requests/day)",
                  "Exclusive Video Tutorials",
                  "Early Access to New Features",
                  "Custom Integrations"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 p-3 rounded-md backdrop-blur-sm">
                    <span className="text-xl">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>
            {isPremium ? (
              <>✨ This page demonstrates <strong>UNLOCKED premium content</strong></>
            ) : (
              <>🔒 This page demonstrates content <strong>BEHIND A PAYWALL</strong></>
            )}
          </p>
          <p className="mt-2">
            {isPremium
              ? 'Payment successful - Full access granted'
              : 'Payment required to unlock premium features'}
          </p>
        </div>
      </div>
    </div>
  );
}
