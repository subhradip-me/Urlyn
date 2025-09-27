'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ProfessionalTeamPage() {
  return (
    <DashboardLayout persona="professional">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600">Manage your team members, roles, and collaborative projects</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Invite Member
          </button>
        </div>

        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🎯</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Team Productivity</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Team Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search team members..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Roles</option>
                <option>Manager</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Yes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-green-600">Online</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Mike Johnson"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Mike Johnson</h4>
                  <p className="text-sm text-gray-500">Senior Developer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">No</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-gray-500">2 hrs ago</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Lisa Wang"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Lisa Wang</h4>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">6</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Design</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-green-600">Online</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="David Kim"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">David Kim</h4>
                  <p className="text-sm text-gray-500">Marketing Specialist</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">No</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-gray-500">1 day ago</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Emily Rodriguez"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500">Data Analyst</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Analytics</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-green-600">Online</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Alex Thompson"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">Alex Thompson</h4>
                  <p className="text-sm text-gray-500">QA Engineer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">No</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Active</span>
                  <span className="text-gray-500">3 hrs ago</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                  Message
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100">
                  View Profile
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="px-4 py-2 text-blue-600 hover:text-blue-800">
              View All Team Members ({23})
            </button>
          </div>
        </div>

        {/* Team Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Project Completion Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">89%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On-Time Delivery</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Collaboration</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-19 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">86%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Goal Achievement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-18 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">84%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📝</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Project milestone completed</p>
                  <p className="text-xs text-blue-600">Sarah Chen completed "User Research Phase" • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✅</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">New team member onboarded</p>
                  <p className="text-xs text-green-600">Alex Thompson joined the QA team • 1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">Team goal achieved</p>
                  <p className="text-xs text-purple-600">Marketing team exceeded monthly targets • 3 days ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">📅</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">Team meeting scheduled</p>
                  <p className="text-xs text-orange-600">Weekly sprint review meeting • Tomorrow 2 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Settings */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings & Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Roles & Permissions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Team Leads</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Editors</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viewers</span>
                  <span className="font-medium">7</span>
                </div>
              </div>
              <button className="w-full mt-3 px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100">
                Manage Permissions
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Communication</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📧 Email Notifications
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  💬 Team Chat
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📹 Video Meetings
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Integrations</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📊 Project Management
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  🔧 Development Tools
                </button>
                <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                  📈 Analytics Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
