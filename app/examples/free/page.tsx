"use client";

export default function FreeContentExample() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">FREE ACCESS</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Free Content Page</h1>
          <p className="text-gray-600">This entire page is accessible without any payment</p>
        </div>

        {/* Content Card 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-green-700">Public Article</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              Welcome to our free content section! This is an example of content that is completely
              accessible to everyone without requiring any payment or authentication.
            </p>
            <p>
              Free content is perfect for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Marketing and user acquisition</li>
              <li>Building trust with your audience</li>
              <li>Providing value before asking for payment</li>
              <li>SEO and discoverability</li>
              <li>Community building</li>
            </ul>
          </div>
        </div>

        {/* Content Card 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Sample Data - Always Available</h2>
          <div className="bg-green-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">15,847</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Active Today</p>
                <p className="text-2xl font-bold text-gray-800">1,234</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-800">98.5%</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-800">99.9%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Free Features</h2>
          <div className="space-y-3">
            {[
              "Access to basic documentation",
              "Community support forums",
              "Public API endpoints",
              "Sample code and tutorials",
              "Newsletter subscription",
              "Basic analytics dashboard"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                <span className="text-green-600 text-xl">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Want More?</h3>
          <p className="mb-4">
            Upgrade to premium to access exclusive features, advanced analytics, and priority support!
          </p>
          <button className="bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
            View Premium Features →
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>✅ This page demonstrates content that is <strong>NOT behind a paywall</strong></p>
          <p className="mt-2">All content above is freely accessible to everyone</p>
        </div>
      </div>
    </div>
  );
}
