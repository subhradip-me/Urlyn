'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function CreatorHomePage() {
  return (
    <DashboardLayout persona="creator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Creator Hub</h1>
            <p className="text-gray-600">Welcome to your creative workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Content Ideas</p>
                <p className="text-2xl font-semibold text-gray-900">32</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M7 8h10m-5 4h5" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">124K</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Creative Projects</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Tutorial Series: Web Design</p>
                  <p className="text-sm text-purple-600">5 episodes published</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Live</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Photography Course</p>
                  <p className="text-sm text-blue-600">Script in progress</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div>
                  <p className="font-medium text-pink-900">Lifestyle Blog Posts</p>
                  <p className="text-sm text-pink-600">Weekly series</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">YouTube</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">45K views</p>
                  <p className="text-sm text-green-600">+12% this week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Instagram</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">23K followers</p>
                  <p className="text-sm text-green-600">+8% this week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Blog</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">12K readers</p>
                  <p className="text-sm text-green-600">+15% this week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">TikTok</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">67K views</p>
                  <p className="text-sm text-green-600">+22% this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Creative Tools & Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="text-purple-600 mb-2">💡</div>
              <div className="text-sm font-medium">Idea Generator</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="text-blue-600 mb-2">📝</div>
              <div className="text-sm font-medium">Script Writer</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="text-green-600 mb-2">📊</div>
              <div className="text-sm font-medium">Analytics</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center transition-colors">
              <div className="text-orange-600 mb-2">📅</div>
              <div className="text-sm font-medium">Content Calendar</div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Content Schedule</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-l-4 border-purple-500 bg-purple-50">
              <div>
                <p className="font-medium text-purple-900">YouTube Video: "5 Design Trends"</p>
                <p className="text-sm text-purple-600">Tomorrow, 3:00 PM</p>
              </div>
              <span className="text-purple-600">📹</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
              <div>
                <p className="font-medium text-blue-900">Instagram Post: Behind the Scenes</p>
                <p className="text-sm text-blue-600">Friday, 12:00 PM</p>
              </div>
              <span className="text-blue-600">📸</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
              <div>
                <p className="font-medium text-green-900">Blog Post: "Creative Process"</p>
                <p className="text-sm text-green-600">Next Monday, 9:00 AM</p>
              </div>
              <span className="text-green-600">✍️</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
