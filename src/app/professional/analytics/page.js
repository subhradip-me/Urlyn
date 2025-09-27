'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ProfessionalAnalyticsPage() {
  return (
    <DashboardLayout persona="professional">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Professional Analytics</h1>
            <p className="text-gray-600">Track your professional growth and team performance</p>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Last 3 months</option>
              <option>Last month</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects Completed</p>
                <p className="text-3xl font-bold text-blue-600">47</p>
              </div>
              <div className="text-green-500 text-sm">↗ +12%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">this quarter</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Productivity</p>
                <p className="text-3xl font-bold text-green-600">89%</p>
              </div>
              <div className="text-green-500 text-sm">↗ +5.2%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">average score</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Client Satisfaction</p>
                <p className="text-3xl font-bold text-purple-600">4.8</p>
              </div>
              <div className="text-green-500 text-sm">↗ +0.3</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">out of 5.0</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-3xl font-bold text-orange-600">$2.4M</p>
              </div>
              <div className="text-green-500 text-sm">↗ +18.7%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">generated</div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Project completion timeline</p>
                <p className="text-sm mt-2">Consistent delivery performance</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Trends</h3>
            <div className="h-64 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>Team productivity trends</p>
                <p className="text-sm mt-2">5.2% improvement this quarter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Digital Marketing Campaign</h4>
                  <p className="text-sm text-gray-500">Q4 2024 • 15 team members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">Completed</p>
                <p className="text-sm text-gray-500">ROI: +340%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">💻</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Product Development Sprint</h4>
                  <p className="text-sm text-gray-500">Ongoing • 8 team members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">85% Complete</p>
                <p className="text-sm text-gray-500">On schedule</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Analytics Platform</h4>
                  <p className="text-sm text-gray-500">Q1 2025 • 12 team members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">Planning</p>
                <p className="text-sm text-gray-500">Budget: $180K</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600">🎨</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Brand Redesign Project</h4>
                  <p className="text-sm text-gray-500">Q4 2024 • 6 team members</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600">In Review</p>
                <p className="text-sm text-gray-500">Client feedback pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Development</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Project Management</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-20 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Expert</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Team Leadership</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-22 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Advanced</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Analysis</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-18 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Proficient</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Strategic Planning</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-21 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Advanced</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Digital Marketing</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div className="w-16 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Intermediate</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Growth Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Complete Advanced Data Science certification</li>
                <li>• Attend leadership workshop series</li>
                <li>• Expand digital marketing knowledge</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Goals 2024</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Lead 5 Major Projects</span>
                  <span className="text-sm font-medium">4/5</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">80% complete</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Team Growth to 25 Members</span>
                  <span className="text-sm font-medium">23/25</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-23/25 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">92% complete</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Revenue Target $3M</span>
                  <span className="text-sm font-medium">$2.4M</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">80% complete</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Client Retention 95%</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal exceeded!</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-lg font-bold text-green-600">3</p>
                <p className="text-xs text-green-600">Goals Achieved</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-600">1</p>
                <p className="text-xs text-blue-600">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Analytics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Analytics Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">23</div>
              <div className="text-sm text-gray-600 mb-4">Team Members</div>
              <div className="text-xs text-green-600">+2 this month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">47</div>
              <div className="text-sm text-gray-600 mb-4">Active Projects</div>
              <div className="text-xs text-blue-600">89% on time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <div className="text-sm text-gray-600 mb-4">Team Rating</div>
              <div className="text-xs text-green-600">+0.3 improvement</div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Department Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Development</span>
                  <span className="text-sm font-medium text-green-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <span className="text-sm font-medium text-blue-600">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Design</span>
                  <span className="text-sm font-medium text-purple-600">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">QA</span>
                  <span className="text-sm font-medium text-orange-600">85%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Resource Utilization</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Development Tools</span>
                  <span className="text-sm font-medium text-green-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Design Software</span>
                  <span className="text-sm font-medium text-blue-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analytics Platforms</span>
                  <span className="text-sm font-medium text-purple-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Communication Tools</span>
                  <span className="text-sm font-medium text-orange-600">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
