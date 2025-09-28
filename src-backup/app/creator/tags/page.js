'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function CreatorTagsPage() {
  return (
    <DashboardLayout persona="creator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Tags</h1>
            <p className="text-gray-600">Organize your content with smart tagging system</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Create Tag
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tech Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">💻</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tech</h3>
                <p className="text-sm text-gray-500">Technology content</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">AI</span>
                <span className="text-xs text-gray-500">24 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Web Development</span>
                <span className="text-xs text-gray-500">18 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Mobile Apps</span>
                <span className="text-xs text-gray-500">12 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Programming</span>
                <span className="text-xs text-gray-500">31 items</span>
              </div>
            </div>
          </div>

          {/* Lifestyle Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600">💖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lifestyle</h3>
                <p className="text-sm text-gray-500">Life and wellness</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded">Health & Fitness</span>
                <span className="text-xs text-gray-500">15 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded">Travel</span>
                <span className="text-xs text-gray-500">22 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded">Food & Cooking</span>
                <span className="text-xs text-gray-500">19 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded">Personal Growth</span>
                <span className="text-xs text-gray-500">27 items</span>
              </div>
            </div>
          </div>

          {/* Tutorial Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🎓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tutorial</h3>
                <p className="text-sm text-gray-500">Educational content</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">How-To Guides</span>
                <span className="text-xs text-gray-500">33 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Step-by-Step</span>
                <span className="text-xs text-gray-500">28 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Beginner Friendly</span>
                <span className="text-xs text-gray-500">21 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Advanced Tips</span>
                <span className="text-xs text-gray-500">16 items</span>
              </div>
            </div>
          </div>

          {/* Video Content Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">🎬</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Video Content</h3>
                <p className="text-sm text-gray-500">Video categories</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">YouTube</span>
                <span className="text-xs text-gray-500">45 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">TikTok</span>
                <span className="text-xs text-gray-500">38 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">Instagram Reels</span>
                <span className="text-xs text-gray-500">29 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">Live Streams</span>
                <span className="text-xs text-gray-500">12 items</span>
              </div>
            </div>
          </div>

          {/* Business Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">💼</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business</h3>
                <p className="text-sm text-gray-500">Business content</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Entrepreneurship</span>
                <span className="text-xs text-gray-500">20 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Marketing</span>
                <span className="text-xs text-gray-500">17 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Social Media</span>
                <span className="text-xs text-gray-500">25 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">Brand Building</span>
                <span className="text-xs text-gray-500">14 items</span>
              </div>
            </div>
          </div>

          {/* Creative Tools Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🎨</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Creative Tools</h3>
                <p className="text-sm text-gray-500">Software & tools</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Adobe Creative</span>
                <span className="text-xs text-gray-500">32 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Figma</span>
                <span className="text-xs text-gray-500">18 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Canva</span>
                <span className="text-xs text-gray-500">24 items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Video Editing</span>
                <span className="text-xs text-gray-500">21 items</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tag Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
              <div className="text-sm text-gray-600">Total Tagged Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24</div>
              <div className="text-sm text-gray-600">Active Tag Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-sm text-gray-600">Content Organization Rate</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
