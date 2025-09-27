'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ProfessionalSharedPage() {
  return (
    <DashboardLayout persona="professional">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shared Resources</h1>
            <p className="text-gray-600">Access and manage shared documents, bookmarks, and team resources</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Share Resource
          </button>
        </div>

        {/* Shared Resource Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📁</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Shared Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🔖</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Team Bookmarks</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Shared Items */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recently Shared</h3>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Types</option>
                <option>Documents</option>
                <option>Bookmarks</option>
                <option>Projects</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📄</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Q4 Marketing Strategy.pdf</h4>
                  <p className="text-sm text-gray-500">Shared by Sarah Chen • Marketing Team • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Document</span>
                <button className="text-blue-600 hover:text-blue-800">View</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🔖</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Industry Research Collection</h4>
                  <p className="text-sm text-gray-500">Shared by Mike Johnson • Research Team • 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Bookmarks</span>
                <button className="text-green-600 hover:text-green-800">Open</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Product Launch Timeline</h4>
                  <p className="text-sm text-gray-500">Shared by Lisa Wang • Product Team • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Project</span>
                <button className="text-purple-600 hover:text-purple-800">Access</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600">📋</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Team Meeting Notes - Sprint 24</h4>
                  <p className="text-sm text-gray-500">Shared by David Kim • Development Team • 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Notes</span>
                <button className="text-orange-600 hover:text-orange-800">Read</button>
              </div>
            </div>
          </div>
        </div>

        {/* Team Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workspaces</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Marketing Team</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">12 members</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Campaigns, analytics, and brand resources</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <div className="w-6 h-6 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+9</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Enter Workspace</button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Development Team</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">8 members</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Code repositories, documentation, and tools</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <div className="w-6 h-6 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+6</span>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-800 text-sm">Enter Workspace</button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Product Team</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">6 members</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Roadmaps, user research, and design assets</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <img src="/placeholder-avatar.jpg" alt="Member" className="w-6 h-6 rounded-full border border-white" />
                    <div className="w-6 h-6 bg-gray-200 rounded-full border border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+4</span>
                    </div>
                  </div>
                  <button className="text-purple-600 hover:text-purple-800 text-sm">Enter Workspace</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Collections</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📚</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Industry Reports</h4>
                    <p className="text-xs text-blue-600">24 documents</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">Browse</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🔗</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Competitor Analysis</h4>
                    <p className="text-xs text-green-600">18 bookmarks</p>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-800">View</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900">Project Templates</h4>
                    <p className="text-xs text-purple-600">12 templates</p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-800">Use</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm">🛠️</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900">Tools & Resources</h4>
                    <p className="text-xs text-orange-600">31 links</p>
                  </div>
                </div>
                <button className="text-orange-600 hover:text-orange-800">Access</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">📋</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-900">Meeting Notes</h4>
                    <p className="text-xs text-red-600">45 notes</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-800">Read</button>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions & Access */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Full Access</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">Marketing Resources</span>
                  <span className="text-green-600">Admin</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">Product Documents</span>
                  <span className="text-green-600">Admin</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">Team Templates</span>
                  <span className="text-green-600">Admin</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Edit Access</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">Development Docs</span>
                  <span className="text-blue-600">Editor</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">Project Plans</span>
                  <span className="text-blue-600">Editor</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">Research Library</span>
                  <span className="text-blue-600">Editor</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">View Only</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Finance Reports</span>
                  <span className="text-gray-600">Viewer</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Executive Updates</span>
                  <span className="text-gray-600">Viewer</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Legal Documents</span>
                  <span className="text-gray-600">Viewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
