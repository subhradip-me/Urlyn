'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ResearcherAnalyticsPage() {
  return (
    <DashboardLayout persona="researcher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Analytics</h1>
            <p className="text-gray-600">Track your research impact and academic progress</p>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>Last 2 years</option>
              <option>All time</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Generate Report
            </button>
          </div>
        </div>

        {/* Key Research Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publications</p>
                <p className="text-3xl font-bold text-indigo-600">42</p>
              </div>
              <div className="text-green-500 text-sm">↗ +7</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">this year</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citations</p>
                <p className="text-3xl font-bold text-green-600">1,247</p>
              </div>
              <div className="text-green-500 text-sm">↗ +18.3%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">total citations</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">h-index</p>
                <p className="text-3xl font-bold text-blue-600">23</p>
              </div>
              <div className="text-green-500 text-sm">↗ +2</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">impact factor</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collaborations</p>
                <p className="text-3xl font-bold text-purple-600">127</p>
              </div>
              <div className="text-green-500 text-sm">↗ +15</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">active partners</div>
          </div>
        </div>

        {/* Publication Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publication Trends</h3>
            <div className="h-64 bg-gradient-to-t from-indigo-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>Publication timeline chart</p>
                <p className="text-sm mt-2">Showing steady growth in research output</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Impact</h3>
            <div className="h-64 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Citation growth chart</p>
                <p className="text-sm mt-2">18.3% increase in citation rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Research Areas Performance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Research Areas Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600">🤖</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Machine Learning & AI</h4>
                  <p className="text-sm text-gray-500">15 publications • 687 citations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-indigo-600">Primary Focus</p>
                <p className="text-sm text-gray-500">45.8 avg citations</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🧬</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Bioinformatics</h4>
                  <p className="text-sm text-gray-500">12 publications • 423 citations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">Growing Area</p>
                <p className="text-sm text-gray-500">35.2 avg citations</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Data Science</h4>
                  <p className="text-sm text-gray-500">9 publications • 287 citations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">Emerging</p>
                <p className="text-sm text-gray-500">31.9 avg citations</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">🔬</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Computational Biology</h4>
                  <p className="text-sm text-gray-500">6 publications • 156 citations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">Specialized</p>
                <p className="text-sm text-gray-500">26.0 avg citations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Journal Impact Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Nature (IF: 69.5)</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">3 papers</p>
                  <p className="text-sm text-green-600">287 citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Science (IF: 56.9)</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">2 papers</p>
                  <p className="text-sm text-green-600">198 citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cell (IF: 66.8)</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">1 paper</p>
                  <p className="text-sm text-green-600">143 citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">PLOS ONE (IF: 3.7)</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">8 papers</p>
                  <p className="text-sm text-green-600">156 citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Other Journals</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">28 papers</p>
                  <p className="text-sm text-green-600">463 citations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Network</h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Top Collaborators</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Dr. Sarah Chen (Stanford)</span>
                    <span className="text-xs text-indigo-600">8 joint papers</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Prof. Marcus Johnson (MIT)</span>
                    <span className="text-xs text-indigo-600">6 joint papers</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Dr. Elena Rodriguez (Oxford)</span>
                    <span className="text-xs text-indigo-600">4 joint papers</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">International Reach</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-700">15</p>
                    <p className="text-xs text-green-600">Countries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-700">47</p>
                    <p className="text-xs text-green-600">Institutions</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Network Growth</h4>
                <p className="text-sm text-blue-700">+23% new collaborators this year</p>
                <div className="mt-2 w-full h-2 bg-blue-200 rounded-full">
                  <div className="w-1/4 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Research Goals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2024 Research Goals</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Publications Target</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-indigo-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">80% complete (12 / 15)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Citations Goal</span>
                  <span className="text-sm font-medium">1,500</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-5/6 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">83% complete (1,247 / 1,500)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">New Collaborations</span>
                  <span className="text-sm font-medium">10</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-3/5 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">60% complete (6 / 10)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">🏆</span>
                <div>
                  <p className="text-sm font-medium text-green-900">Best Paper Award</p>
                  <p className="text-xs text-green-600">ICML 2024 Conference</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600">📈</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">h-index Milestone</p>
                  <p className="text-xs text-blue-600">Reached h-index of 23</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600">🤝</span>
                <div>
                  <p className="text-sm font-medium text-purple-900">Major Collaboration</p>
                  <p className="text-xs text-purple-600">NIH $2.5M Grant Awarded</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Milestones</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-600">📚</span>
                <div>
                  <p className="text-sm font-medium text-orange-900">Book Publication</p>
                  <p className="text-xs text-orange-600">AI in Healthcare - Q2 2024</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-600">🎤</span>
                <div>
                  <p className="text-sm font-medium text-red-900">Keynote Speech</p>
                  <p className="text-xs text-red-600">NeurIPS 2024 Conference</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                <span className="text-indigo-600">🔬</span>
                <div>
                  <p className="text-sm font-medium text-indigo-900">Research Grant</p>
                  <p className="text-xs text-indigo-600">NSF Proposal Submission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
