'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function EntrepreneurAnalyticsPage() {
  return (
    <DashboardLayout persona="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
            <p className="text-gray-600">Track your entrepreneurial journey and business performance</p>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last year</option>
              <option>All time</option>
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
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-3xl font-bold text-green-600">$2.4M</p>
              </div>
              <div className="text-green-500 text-sm">↗ +15.2%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last quarter</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Ventures</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="text-blue-500 text-sm">+3</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">this quarter</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network Growth</p>
                <p className="text-3xl font-bold text-purple-600">847</p>
              </div>
              <div className="text-green-500 text-sm">↗ +28.3%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">connections</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-orange-600">72%</p>
              </div>
              <div className="text-green-500 text-sm">↗ +5.1%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">venture success</div>
          </div>
        </div>

        {/* Business Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
            <div className="h-64 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>Revenue trend chart</p>
                <p className="text-sm mt-2">Showing 125% growth over 12 months</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment ROI</h3>
            <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
              <div className="text-gray-500 text-center">
                <div className="text-4xl mb-2">💰</div>
                <p>ROI performance chart</p>
                <p className="text-sm mt-2">Average 24.8% return across portfolio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Venture Performance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Ventures</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">🚀</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">TechFlow AI Solutions</h4>
                  <p className="text-sm text-gray-500">AI/ML Platform • Founded 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+187% ROI</p>
                <p className="text-sm text-gray-500">$2.1M valuation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🌱</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">GreenTech Solutions</h4>
                  <p className="text-sm text-gray-500">Sustainability • Founded 2022</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">+124% ROI</p>
                <p className="text-sm text-gray-500">$1.8M valuation</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">💳</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">FinanceApp Pro</h4>
                  <p className="text-sm text-gray-500">FinTech • Founded 2021</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-600">+98% ROI</p>
                <p className="text-sm text-gray-500">$3.2M valuation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sector Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Technology</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">45%</p>
                  <p className="text-sm text-green-600">High growth</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">CleanTech</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">25%</p>
                  <p className="text-sm text-green-600">Emerging</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">FinTech</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">20%</p>
                  <p className="text-sm text-blue-600">Stable</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Healthcare</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">10%</p>
                  <p className="text-sm text-yellow-600">Moderate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Low Risk</span>
                  <span className="text-sm text-green-600">60%</span>
                </div>
                <div className="w-full h-2 bg-green-200 rounded-full">
                  <div className="w-3/5 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-900">Medium Risk</span>
                  <span className="text-sm text-yellow-600">30%</span>
                </div>
                <div className="w-full h-2 bg-yellow-200 rounded-full">
                  <div className="w-1/3 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">High Risk</span>
                  <span className="text-sm text-red-600">10%</span>
                </div>
                <div className="w-full h-2 bg-red-200 rounded-full">
                  <div className="w-1/10 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Risk Score:</span> 3.2/10 (Low-Medium)
                </p>
                <p className="text-xs text-blue-600 mt-1">Well-diversified portfolio with controlled exposure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month Projections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">$3.2M</div>
              <div className="text-sm text-gray-600">Projected Portfolio Value</div>
              <div className="text-xs text-green-600 mt-1">+33% growth</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
              <div className="text-sm text-gray-600">Expected Exits</div>
              <div className="text-xs text-blue-600 mt-1">$1.2M returns</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
              <div className="text-sm text-gray-600">New Opportunities</div>
              <div className="text-xs text-purple-600 mt-1">$750K investment</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
