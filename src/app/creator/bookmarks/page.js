'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function CreatorBookmarksPage() {
  return (
    <DashboardLayout persona="creator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Creative Bookmarks</h1>
            <p className="text-gray-600">Your saved inspiration and creative resources</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Add Bookmark
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample creative bookmark cards */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-semibold">🎨</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Color Palette Generator</h3>
                <p className="text-sm text-gray-500">coolors.co</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Generate beautiful color palettes for your creative projects</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Design Tools</span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📹</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Video Editing Tutorial</h3>
                <p className="text-sm text-gray-500">youtube.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Advanced techniques for cinematic video editing</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Video</span>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">📸</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Photography Inspiration</h3>
                <p className="text-sm text-gray-500">unsplash.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">High-quality photos for creative projects and inspiration</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Photography</span>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Creative Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-pink-50 rounded-lg text-center">
              <div className="text-pink-600 mb-2">🎨</div>
              <div className="text-sm font-medium">Design Tools</div>
              <div className="text-xs text-gray-500">18 bookmarks</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-blue-600 mb-2">📹</div>
              <div className="text-sm font-medium">Video Resources</div>
              <div className="text-xs text-gray-500">12 bookmarks</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 mb-2">📸</div>
              <div className="text-sm font-medium">Photography</div>
              <div className="text-xs text-gray-500">9 bookmarks</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-purple-600 mb-2">✍️</div>
              <div className="text-sm font-medium">Writing & Scripts</div>
              <div className="text-xs text-gray-500">7 bookmarks</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
