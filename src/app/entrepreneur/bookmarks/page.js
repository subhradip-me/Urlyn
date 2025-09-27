'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function EntrepreneurBookmarksPage() {
  return (
    <DashboardLayout persona="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Bookmarks</h1>
            <p className="text-gray-600">Your saved business resources and opportunities</p>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Add Bookmark
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample business bookmark cards */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">💰</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Startup Funding Guide</h3>
                <p className="text-sm text-gray-500">fundingstartups.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Comprehensive guide to securing seed funding and venture capital</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Funding</span>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Market Analysis Platform</h3>
                <p className="text-sm text-gray-500">marketresearch.pro</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Real-time market data and competitive analysis tools</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Market Research</span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🤝</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Business Networking Event</h3>
                <p className="text-sm text-gray-500">entrepreneurnetwork.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Upcoming networking events and business meetups in your area</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Networking</span>
              <span className="text-xs text-gray-400">5 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 mb-2">💰</div>
              <div className="text-sm font-medium">Funding</div>
              <div className="text-xs text-gray-500">14 bookmarks</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-blue-600 mb-2">📊</div>
              <div className="text-sm font-medium">Market Research</div>
              <div className="text-xs text-gray-500">11 bookmarks</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-purple-600 mb-2">🤝</div>
              <div className="text-sm font-medium">Partnerships</div>
              <div className="text-xs text-gray-500">8 bookmarks</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="text-orange-600 mb-2">🚀</div>
              <div className="text-sm font-medium">Startup Tools</div>
              <div className="text-xs text-gray-500">16 bookmarks</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
