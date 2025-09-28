'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function CreatorContentVaultPage() {
  return (
    <DashboardLayout persona="creator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Vault</h1>
            <p className="text-gray-600">Your creative assets and content organization hub</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Add Content
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ideas Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Ideas</h3>
                <p className="text-sm text-gray-500">Creative Concepts</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Store and organize your creative ideas and inspiration</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">34 Ideas</span>
              <span className="text-xs text-gray-400">Last updated: 2h ago</span>
            </div>
          </div>

          {/* Scripts Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Scripts</h3>
                <p className="text-sm text-gray-500">Content Scripts</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Video scripts, podcast outlines, and written content</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">12 Scripts</span>
              <span className="text-xs text-gray-400">Last updated: 1d ago</span>
            </div>
          </div>

          {/* References Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📚</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">References</h3>
                <p className="text-sm text-gray-500">Resource Library</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Reference materials, tutorials, and inspiration sources</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">56 References</span>
              <span className="text-xs text-gray-400">Last updated: 3h ago</span>
            </div>
          </div>

          {/* Assets Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎨</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Design Assets</h3>
                <p className="text-sm text-gray-500">Visual Elements</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Logos, graphics, templates, and visual assets</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">89 Assets</span>
              <span className="text-xs text-gray-400">Last updated: 4h ago</span>
            </div>
          </div>

          {/* Audio Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🎵</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Audio Library</h3>
                <p className="text-sm text-gray-500">Sound Resources</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Music tracks, sound effects, and audio clips</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">23 Tracks</span>
              <span className="text-xs text-gray-400">Last updated: 2d ago</span>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">🎬</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Video Archive</h3>
                <p className="text-sm text-gray-500">Video Content</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Raw footage, completed videos, and video templates</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">15 Videos</span>
              <span className="text-xs text-gray-400">Last updated: 1d ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New idea added: "AI-powered content creation workflow"</p>
                <p className="text-xs text-gray-500">2 hours ago in Ideas</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Script completed: "How to Create Engaging Video Content"</p>
                <p className="text-xs text-gray-500">1 day ago in Scripts</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Added 5 new reference materials for video editing techniques</p>
                <p className="text-xs text-gray-500">3 days ago in References</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
