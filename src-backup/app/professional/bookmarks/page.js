'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ProfessionalBookmarksPage() {
  return (
    <DashboardLayout persona="professional">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Professional Bookmarks</h1>
            <p className="text-gray-600">Manage your work-related bookmarks and resources</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Bookmark
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample bookmark cards */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Project Management Tool</h3>
                <p className="text-sm text-gray-500">productivity.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Comprehensive project tracking and team collaboration platform</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Work Tools</span>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">📈</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Market Research Report</h3>
                <p className="text-sm text-gray-500">reports.industryinsights.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Latest market trends and competitive analysis for Q4 2024</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Research</span>
              <span className="text-xs text-gray-400">1 week ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">👥</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Team Collaboration Guide</h3>
                <p className="text-sm text-gray-500">teamwork.bestpractices.org</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Best practices for remote team management and communication</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Team Management</span>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookmark Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-blue-600 mb-2">💼</div>
              <div className="text-sm font-medium">Work Tools</div>
              <div className="text-xs text-gray-500">12 bookmarks</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 mb-2">📊</div>
              <div className="text-sm font-medium">Analytics</div>
              <div className="text-xs text-gray-500">8 bookmarks</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-purple-600 mb-2">👥</div>
              <div className="text-sm font-medium">Team Resources</div>
              <div className="text-xs text-gray-500">15 bookmarks</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="text-orange-600 mb-2">📈</div>
              <div className="text-sm font-medium">Market Research</div>
              <div className="text-xs text-gray-500">6 bookmarks</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
