'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ResearcherBookmarksPage() {
  return (
    <DashboardLayout persona="researcher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Bookmarks</h1>
            <p className="text-gray-600">Your saved research papers, datasets, and academic resources</p>
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Add Bookmark
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample research bookmark cards */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📄</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Machine Learning Survey Paper</h3>
                <p className="text-sm text-gray-500">arxiv.org</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Comprehensive survey on recent advances in deep learning methodologies</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">ML Research</span>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Climate Data Repository</h3>
                <p className="text-sm text-gray-500">climate-data.gov</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Comprehensive climate and environmental datasets for research analysis</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Climate Science</span>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🔬</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Quantum Computing Lab</h3>
                <p className="text-sm text-gray-500">quantumlab.mit.edu</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Latest research papers and findings in quantum computing applications</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Quantum Physics</span>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-blue-600 mb-2">📚</div>
              <div className="text-sm font-medium">Literature</div>
              <div className="text-xs text-gray-500">24 bookmarks</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 mb-2">📊</div>
              <div className="text-sm font-medium">Datasets</div>
              <div className="text-xs text-gray-500">16 bookmarks</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-purple-600 mb-2">🔬</div>
              <div className="text-sm font-medium">Lab Resources</div>
              <div className="text-xs text-gray-500">11 bookmarks</div>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg text-center">
              <div className="text-teal-600 mb-2">🤝</div>
              <div className="text-sm font-medium">Collaborations</div>
              <div className="text-xs text-gray-500">8 bookmarks</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
