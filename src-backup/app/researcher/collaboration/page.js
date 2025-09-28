'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ResearcherCollaborationPage() {
  return (
    <DashboardLayout persona="researcher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Collaboration</h1>
            <p className="text-gray-600">Connect and collaborate with fellow researchers</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Find Collaborators
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              New Project
            </button>
          </div>
        </div>

        {/* Collaboration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600">👥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-sm text-gray-600">Research Partners</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">🚀</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📄</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-600">Co-authored Papers</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🌍</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">23</p>
                <p className="text-sm text-gray-600">International Partnerships</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Collaborative Projects</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">AI in Medical Diagnosis Research</h4>
                  <p className="text-sm text-gray-500">Multi-institutional study on machine learning applications</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Active</span>
              </div>
              <div className="flex items-center space-x-6 mb-3">
                <div className="flex -space-x-2">
                  <img src="/placeholder-avatar.jpg" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/placeholder-avatar.jpg" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/placeholder-avatar.jpg" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white" />
                  <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+5</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Progress:</span> 65%
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Deadline:</span> Dec 2024
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                <div className="w-2/3 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Machine Learning</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Healthcare</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">View Details</button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Climate Change Data Analysis</h4>
                  <p className="text-sm text-gray-500">Global collaboration on environmental data patterns</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Planning</span>
              </div>
              <div className="flex items-center space-x-6 mb-3">
                <div className="flex -space-x-2">
                  <img src="/placeholder-avatar.jpg" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="/placeholder-avatar.jpg" alt="Collaborator" className="w-8 h-8 rounded-full border-2 border-white" />
                  <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+3</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Progress:</span> 25%
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Start:</span> Feb 2024
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-3">
                <div className="w-1/4 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Environmental Science</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Data Analysis</span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Research Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Network</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder-avatar.jpg" alt="Researcher" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-900">Dr. Sarah Chen</h4>
                    <p className="text-sm text-gray-500">Stanford University • AI Research</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">3 Projects</span>
                  <button className="text-indigo-600 hover:text-indigo-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder-avatar.jpg" alt="Researcher" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-900">Prof. Marcus Johnson</h4>
                    <p className="text-sm text-gray-500">MIT • Machine Learning</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">2 Projects</span>
                  <button className="text-indigo-600 hover:text-indigo-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder-avatar.jpg" alt="Researcher" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-900">Dr. Elena Rodriguez</h4>
                    <p className="text-sm text-gray-500">Oxford • Environmental Science</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">1 Project</span>
                  <button className="text-indigo-600 hover:text-indigo-800">💬</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src="/placeholder-avatar.jpg" alt="Researcher" className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-gray-900">Dr. Raj Patel</h4>
                    <p className="text-sm text-gray-500">Carnegie Mellon • Data Science</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">4 Projects</span>
                  <button className="text-indigo-600 hover:text-indigo-800">💬</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Opportunities</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Neural Networks in Drug Discovery</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">New</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Looking for machine learning experts to collaborate on pharmaceutical research</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Harvard Medical School</p>
                    <p className="text-xs text-gray-500">Posted 2 days ago</p>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                    Apply
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Quantum Computing Applications</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Featured</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">International project on quantum algorithms for optimization problems</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">CERN Research</p>
                    <p className="text-xs text-gray-500">Posted 1 week ago</p>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                    Apply
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Social Media Impact Study</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Urgent</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Cross-disciplinary research on social media effects on mental health</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">University of California</p>
                    <p className="text-xs text-gray-500">Posted 3 days ago</p>
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Hub</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">💬</span>
                  <div>
                    <p className="font-medium text-blue-900">Team Chat</p>
                    <p className="text-xs text-blue-600">5 unread messages</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">Open</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">📹</span>
                  <div>
                    <p className="font-medium text-green-900">Video Meetings</p>
                    <p className="text-xs text-green-600">Next: Today 3 PM</p>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-800">Join</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600">📧</span>
                  <div>
                    <p className="font-medium text-purple-900">Email Updates</p>
                    <p className="text-xs text-purple-600">3 new notifications</p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-800">View</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shared Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-orange-600">📊</span>
                  <div>
                    <p className="font-medium text-orange-900">Data Sets</p>
                    <p className="text-xs text-orange-600">12 shared datasets</p>
                  </div>
                </div>
                <button className="text-orange-600 hover:text-orange-800">Access</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-red-600">📄</span>
                  <div>
                    <p className="font-medium text-red-900">Documents</p>
                    <p className="text-xs text-red-600">23 collaborative docs</p>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-800">Open</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-indigo-600">🔬</span>
                  <div>
                    <p className="font-medium text-indigo-900">Lab Tools</p>
                    <p className="text-xs text-indigo-600">8 shared instruments</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">Book</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Management</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">📋</span>
                  <div>
                    <p className="font-medium text-gray-900">Task Board</p>
                    <p className="text-xs text-gray-600">7 pending tasks</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">View</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">📅</span>
                  <div>
                    <p className="font-medium text-gray-900">Timeline</p>
                    <p className="text-xs text-gray-600">3 milestones</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">Check</button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">📈</span>
                  <div>
                    <p className="font-medium text-gray-900">Progress</p>
                    <p className="text-xs text-gray-600">Overall: 68%</p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
