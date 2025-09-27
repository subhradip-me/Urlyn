'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function EntrepreneurDashboardPage() {
  return (
    <DashboardLayout persona="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-gray-600">Monitor your ventures and market opportunities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Ventures</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-semibold text-gray-900">$127K</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">+8% ROI</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Partnerships</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-blue-600 text-sm">2 new this week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Score</p>
                <p className="text-2xl font-semibold text-gray-900">8.7</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">Excellent rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    T
                  </div>
                  <div>
                    <p className="font-medium">TechFlow Startup</p>
                    <p className="text-sm text-gray-600">Series A</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+24%</p>
                  <p className="text-sm text-gray-600">$45K</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    G
                  </div>
                  <div>
                    <p className="font-medium">GreenTech Solutions</p>
                    <p className="text-sm text-gray-600">Seed Round</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+18%</p>
                  <p className="text-sm text-gray-600">$32K</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    F
                  </div>
                  <div>
                    <p className="font-medium">FinanceAI Platform</p>
                    <p className="text-sm text-gray-600">Pre-Series A</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">+8%</p>
                  <p className="text-sm text-gray-600">$50K</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Market Insights</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-medium text-gray-900">AI/ML Market Growth</p>
                <p className="text-sm text-gray-600">Expected 40% growth in Q4</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium text-gray-900">Sustainable Tech Funding</p>
                <p className="text-sm text-gray-600">$2.1B raised in green tech</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900">FinTech Regulations</p>
                <p className="text-sm text-gray-600">New compliance requirements</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium text-gray-900">Healthcare Innovation</p>
                <p className="text-sm text-gray-600">Telemedicine expansion opportunities</p>
                <p className="text-xs text-gray-400">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
