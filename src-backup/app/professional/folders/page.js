'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ProfessionalFoldersPage() {
  return (
    <DashboardLayout persona="professional">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Folders</h1>
            <p className="text-gray-600">Organize your professional projects and resources</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Folder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sample project folders */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Project Alpha</h3>
                <p className="text-sm text-gray-500">Client: TechCorp Inc.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Enterprise software solution development project</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>
              <span className="text-xs text-gray-400">24 items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🔍</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Client Research</h3>
                <p className="text-sm text-gray-500">Market Analysis</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Comprehensive client and market research documentation</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Research</span>
              <span className="text-xs text-gray-400">18 items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Team Resources</h3>
                <p className="text-sm text-gray-500">Internal Documentation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Team guidelines, processes, and shared resources</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Team</span>
              <span className="text-xs text-gray-400">31 items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Analytics & Reports</h3>
                <p className="text-sm text-gray-500">Performance Data</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Project metrics, performance reports, and analytics</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Analytics</span>
              <span className="text-xs text-gray-400">12 items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🚀</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Product Launch</h3>
                <p className="text-sm text-gray-500">Q4 2024</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Product launch strategy and marketing materials</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Launch</span>
              <span className="text-xs text-gray-400">15 items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-xl">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Meeting Notes</h3>
                <p className="text-sm text-gray-500">Weekly Syncs</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Client meetings, team syncs, and project discussions</p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Notes</span>
              <span className="text-xs text-gray-400">42 items</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Folder Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">📁</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Organize Projects</h3>
              <p className="text-sm text-gray-600">Keep your projects organized and easily accessible</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-2xl">👥</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-sm text-gray-600">Share folders and collaborate with team members</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-2xl">🔍</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Quick Access</h3>
              <p className="text-sm text-gray-600">Find and access your resources quickly</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
