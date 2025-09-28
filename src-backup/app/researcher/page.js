'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ResearcherHomePage() {
  return (
    <DashboardLayout persona="researcher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Hub</h1>
            <p className="text-gray-600">Welcome to your academic and scientific workspace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Papers Reviewed</p>
                <p className="text-2xl font-semibold text-gray-900">147</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900">4</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Collaborators</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Research Projects</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <div>
                  <p className="font-medium text-teal-900">Machine Learning in Healthcare</p>
                  <p className="text-sm text-teal-600">Data collection phase</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Climate Change Impact Study</p>
                  <p className="text-sm text-blue-600">Literature review complete</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Analysis</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Quantum Computing Applications</p>
                  <p className="text-sm text-green-600">Manuscript preparation</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Writing</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Tools</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <div className="text-teal-600 mb-2">📚</div>
                <div className="text-sm font-medium">Literature Review</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <div className="text-blue-600 mb-2">📊</div>
                <div className="text-sm font-medium">Data Analysis</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <div className="text-green-600 mb-2">📝</div>
                <div className="text-sm font-medium">Citation Manager</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                <div className="text-purple-600 mb-2">🤝</div>
                <div className="text-sm font-medium">Collaborate</div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Publications & Updates</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-teal-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New paper accepted in Journal of AI Research</p>
                <p className="text-sm text-gray-600">"Deep Learning Approaches to Medical Image Analysis" - Co-authored with Dr. Smith</p>
                <p className="text-xs text-gray-400">Published 2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Conference presentation scheduled</p>
                <p className="text-sm text-gray-600">International Conference on Machine Learning 2024 - Presentation on quantum algorithms</p>
                <p className="text-xs text-gray-400">Scheduled for next month</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Research grant approved</p>
                <p className="text-sm text-gray-600">$150K funding for climate change research project from NSF</p>
                <p className="text-xs text-gray-400">Approved 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
