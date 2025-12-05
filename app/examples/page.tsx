"use client";

import Link from "next/link";
import { Lock, Unlock, FileText, ArrowRight } from "lucide-react";

export default function ExamplesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-800">Paywall Examples</h1>
          <p className="text-xl text-gray-600">
            Explore different implementations of paywalls and free content
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Free Content Example */}
          <Link href="/examples/free">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-500 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Unlock className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Free Content</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Example of a page with content that is completely free and accessible to everyone
                without any payment or authentication required.
              </p>

              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-green-800 mb-2">Features:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ No paywall</li>
                  <li>✓ Always accessible</li>
                  <li>✓ Public content</li>
                  <li>✓ SEO friendly</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                <span>View Example</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Premium Content Example */}
          <Link href="/examples/premium">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-500 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Lock className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Premium Content</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Example of a page with content protected by a paywall. Shows both locked and
                unlocked states with visual feedback.
              </p>

              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">Features:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🔒 Paywall protected</li>
                  <li>✓ Free preview section</li>
                  <li>✓ Blur effect on locked content</li>
                  <li>✓ Unlock simulation</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                <span>View Example</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Main Demo */}
          <Link href="/">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-500 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Main x402 Payment Demo</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Interactive demo showing both free and premium content sections side-by-side,
                with real blockchain payment integration using the x402 protocol.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">Features:</p>
                <div className="grid md:grid-cols-2 gap-2">
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Free content section</li>
                    <li>✓ Premium paywall section</li>
                    <li>✓ Real payment integration</li>
                    <li>✓ Transaction logging</li>
                  </ul>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Avalanche Fuji testnet</li>
                    <li>✓ Thirdweb integration</li>
                    <li>✓ Multiple payment tiers</li>
                    <li>✓ Real-time status updates</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Go to Main Demo</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">About These Examples</h3>
          <div className="space-y-2 text-gray-600">
            <p>
              These examples demonstrate different approaches to implementing paywalls and managing
              content access in a web3 application.
            </p>
            <p>
              <strong className="text-gray-800">Free Content:</strong> Best for marketing pages,
              blog posts, documentation, and building user trust.
            </p>
            <p>
              <strong className="text-gray-800">Premium Content:</strong> Ideal for exclusive
              features, advanced analytics, premium tutorials, and API access.
            </p>
            <p>
              <strong className="text-gray-800">x402 Protocol:</strong> Enables micropayments
              directly through HTTP requests, making it easy to monetize content and APIs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
