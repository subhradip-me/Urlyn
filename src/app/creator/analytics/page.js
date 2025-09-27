'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function CreatorAnalyticsPage() {
  return (
    <DashboardLayout persona="creator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
            <p className="text-gray-600">Track your content performance across platforms</p>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-blue-600">1.2M</p>
              </div>
              <div className="text-green-500 text-sm">↗ +12.5%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-3xl font-bold text-green-600">8.4%</p>
              </div>
              <div className="text-green-500 text-sm">↗ +2.1%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Followers</p>
                <p className="text-3xl font-bold text-purple-600">15.2K</p>
              </div>
              <div className="text-green-500 text-sm">↗ +18.3%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last month</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-orange-600">$4.8K</p>
              </div>
              <div className="text-green-500 text-sm">↗ +25.7%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last month</div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">📺</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">YouTube</p>
                    <p className="text-sm text-gray-500">567K views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">47%</p>
                  <p className="text-sm text-green-600">+5.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">TikTok</p>
                    <p className="text-sm text-gray-500">432K views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">36%</p>
                  <p className="text-sm text-green-600">+12.8%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📷</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Instagram</p>
                    <p className="text-sm text-gray-500">198K views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">17%</p>
                  <p className="text-sm text-red-600">-3.1%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">🎬</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tutorials</p>
                    <p className="text-sm text-gray-500">23 videos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">385K</p>
                  <p className="text-sm text-green-600">avg views</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">💡</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Tips & Tricks</p>
                    <p className="text-sm text-gray-500">18 videos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">264K</p>
                  <p className="text-sm text-green-600">avg views</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reviews</p>
                    <p className="text-sm text-gray-500">12 videos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">198K</p>
                  <p className="text-sm text-green-600">avg views</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Growth Trend</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg">Views</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">Followers</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">Revenue</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-t from-purple-50 to-transparent rounded-lg flex items-end justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>Interactive chart would be displayed here</p>
              <p className="text-sm mt-2">Showing consistent growth across all metrics</p>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Content</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600">🎬</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">How to Build Your First App in 2024</h4>
                  <p className="text-sm text-gray-500">Tutorial • YouTube • 3 days ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">127K views</p>
                <p className="text-sm text-green-600">9.2% engagement</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">📱</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">5 Productivity Hacks Every Developer Needs</h4>
                  <p className="text-sm text-gray-500">Tips • TikTok • 1 week ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">89K views</p>
                <p className="text-sm text-green-600">12.8% engagement</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">React vs Vue: Which Should You Choose?</h4>
                  <p className="text-sm text-gray-500">Comparison • Instagram • 5 days ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">64K views</p>
                <p className="text-sm text-green-600">7.5% engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
