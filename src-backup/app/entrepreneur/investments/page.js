'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function EntrepreneurInvestmentsPage() {
  return (
    <DashboardLayout persona="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
            <p className="text-gray-600">Track and manage your investment opportunities</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Add Investment
          </button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-green-600">$2.4M</p>
              </div>
              <div className="text-green-500 text-sm">↗ +15.2%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">vs last quarter</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investments</p>
                <p className="text-3xl font-bold text-blue-600">23</p>
              </div>
              <div className="text-blue-500 text-sm">+3</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">this month</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ROI Average</p>
                <p className="text-3xl font-bold text-purple-600">24.8%</p>
              </div>
              <div className="text-green-500 text-sm">↗ +2.1%</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">yearly average</div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exits This Year</p>
                <p className="text-3xl font-bold text-orange-600">5</p>
              </div>
              <div className="text-green-500 text-sm">$680K</div>
            </div>
            <div className="mt-4 text-xs text-gray-500">total returns</div>
          </div>
        </div>

        {/* Investment Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Tech Startups</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">45%</p>
                  <p className="text-sm text-gray-500">$1.08M</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Real Estate</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">25%</p>
                  <p className="text-sm text-gray-500">$600K</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Crypto/DeFi</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">15%</p>
                  <p className="text-sm text-gray-500">$360K</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Traditional Stocks</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">10%</p>
                  <p className="text-sm text-gray-500">$240K</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Other Assets</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">5%</p>
                  <p className="text-sm text-gray-500">$120K</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Investments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">TechFlow AI</h4>
                  <p className="text-sm text-gray-500">Series A • Invested Jan 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+187%</p>
                  <p className="text-sm text-gray-500">$50K → $143.5K</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">GreenTech Solutions</h4>
                  <p className="text-sm text-gray-500">Seed • Invested Mar 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+124%</p>
                  <p className="text-sm text-gray-500">$25K → $56K</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">FinanceApp Pro</h4>
                  <p className="text-sm text-gray-500">Series B • Invested Aug 2022</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+98%</p>
                  <p className="text-sm text-gray-500">$75K → $148.5K</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">DataMine Corp</h4>
                  <p className="text-sm text-gray-500">Series A • Invested May 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-yellow-600">+12%</p>
                  <p className="text-sm text-gray-500">$40K → $44.8K</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Investment Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">📈</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">New Investment Opportunity</h4>
                  <p className="text-sm text-gray-500">CloudScale Technologies - Series A Round</p>
                  <p className="text-xs text-gray-400">Due diligence in progress</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">$75K</p>
                <p className="text-sm text-blue-600">Under Review</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">💰</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dividend Payment Received</h4>
                  <p className="text-sm text-gray-500">TechFlow AI - Q4 2024 Distribution</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+$12.5K</p>
                <p className="text-sm text-gray-500">8.7% yield</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Exit Completed</h4>
                  <p className="text-sm text-gray-500">MobileFirst Inc - Acquired by TechGiant</p>
                  <p className="text-xs text-gray-400">1 week ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+$185K</p>
                <p className="text-sm text-gray-500">270% ROI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Goals 2024</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Portfolio Growth Target</span>
                  <span className="text-sm font-medium">$3M</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">80% complete ($2.4M / $3M)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">New Investments</span>
                  <span className="text-sm font-medium">15</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-3/5 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">60% complete (9 / 15)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Successful Exits</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="w-5/8 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">62% complete (5 / 8)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📊 Market Trend Alert</h4>
                <p className="text-sm text-blue-700">AI/ML startups showing 40% higher valuations this quarter</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">💡 Investment Opportunity</h4>
                <p className="text-sm text-green-700">CleanTech sector presenting attractive risk-reward ratios</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">⚠️ Risk Advisory</h4>
                <p className="text-sm text-orange-700">Consider diversification in emerging markets exposure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
