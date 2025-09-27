'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function EntrepreneurNetworkPage() {
  return (
    <DashboardLayout persona="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Professional Network</h1>
            <p className="text-gray-600">Build and manage your entrepreneurial connections</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Contact
          </button>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">847</p>
                <p className="text-sm text-gray-600">Total Connections</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🤝</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">Active Partnerships</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Investment Leads</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">🎯</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Mentors & Advisors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Network Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Connections</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/placeholder-avatar.jpg" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                    <p className="text-sm text-gray-500">VC Partner at TechVentures</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Investor</span>
                  <button className="text-blue-600 hover:text-blue-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/placeholder-avatar.jpg" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Marcus Rodriguez</h4>
                    <p className="text-sm text-gray-500">CEO at StartupLabs</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Mentor</span>
                  <button className="text-blue-600 hover:text-blue-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/placeholder-avatar.jpg" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">Emily Watson</h4>
                    <p className="text-sm text-gray-500">Co-founder at TechFlow</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Partner</span>
                  <button className="text-blue-600 hover:text-blue-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/placeholder-avatar.jpg" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">David Kim</h4>
                    <p className="text-sm text-gray-500">Head of Innovation at Corp Inc.</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Client</span>
                  <button className="text-blue-600 hover:text-blue-800">💬</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Growth</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Investors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mentors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">83%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Partners</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">50%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Industry Experts</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-18 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Potential Clients</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-10 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">42%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Networking Goal</h4>
              <p className="text-sm text-blue-700">Connect with 50 new industry leaders this quarter</p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-full h-2 bg-blue-200 rounded-full">
                  <div className="w-3/5 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-blue-900">30/50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Network Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New connection with Alex Thompson (FinTech Investor)</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">💬</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Received message from Sarah Chen about funding opportunity</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">🤝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Partnership agreement signed with TechFlow</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">📅</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Scheduled mentorship session with Marcus Rodriguez</p>
                <p className="text-xs text-gray-500">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
