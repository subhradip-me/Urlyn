'use client';

import { DashboardLayout } from '@/components/dashboard-layout';

export default function ResearcherCitationsPage() {
  return (
    <DashboardLayout persona="researcher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Citations & References</h1>
            <p className="text-gray-600">Manage your research citations and bibliography</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Import Bibliography
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Add Citation
            </button>
          </div>
        </div>

        {/* Citation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600">📚</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-sm text-gray-600">Total Citations</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📄</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-sm text-gray-600">Journal Articles</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📖</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">67</p>
                <p className="text-sm text-gray-600">Books & Chapters</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600">🌐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">122</p>
                <p className="text-sm text-gray-600">Online Sources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Citation Formats */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Citation Formats</h3>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>APA 7th Edition</option>
              <option>MLA 9th Edition</option>
              <option>Chicago 17th Edition</option>
              <option>Harvard</option>
              <option>IEEE</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">APA Style</h4>
              <p className="text-sm text-indigo-700">Smith, J. (2023). Research methodology in data science. Journal of Applied Research, 15(3), 234-251.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">MLA Style</h4>
              <p className="text-sm text-green-700">Smith, John. "Research Methodology in Data Science." Journal of Applied Research, vol. 15, no. 3, 2023, pp. 234-251.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Chicago Style</h4>
              <p className="text-sm text-blue-700">Smith, John. "Research Methodology in Data Science." Journal of Applied Research 15, no. 3 (2023): 234-251.</p>
            </div>
          </div>
        </div>

        {/* Recent Citations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Citations</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">Machine Learning Applications in Healthcare</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Journal</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Johnson, A., et al. (2024). Nature Medicine, 30(2), 123-145.</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Added 2 days ago</span>
                  <span>•</span>
                  <span>DOI: 10.1038/nm.2024.456</span>
                  <button className="text-indigo-600 hover:text-indigo-800">Copy</button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">Deep Learning: Foundations and Applications</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Book</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Martinez, R. & Chen, L. (2023). MIT Press.</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Added 1 week ago</span>
                  <span>•</span>
                  <span>ISBN: 978-0262047890</span>
                  <button className="text-indigo-600 hover:text-indigo-800">Copy</button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">Ethical AI Development Guidelines</h4>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Web</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">AI Ethics Institute. (2024). Retrieved from https://aiethics.org/guidelines</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Added 2 weeks ago</span>
                  <span>•</span>
                  <span>Accessed: Jan 15, 2024</span>
                  <button className="text-indigo-600 hover:text-indigo-800">Copy</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Categories</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Machine Learning</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">67</p>
                  <p className="text-xs text-gray-500">citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Data Science</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">54</p>
                  <p className="text-xs text-gray-500">citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">AI Ethics</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">43</p>
                  <p className="text-xs text-gray-500">citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Healthcare AI</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">38</p>
                  <p className="text-xs text-gray-500">citations</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Research Methods</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">32</p>
                  <p className="text-xs text-gray-500">citations</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-2">Citation Tools</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded">
                  📝 Generate Bibliography
                </button>
                <button className="w-full text-left p-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded">
                  🔍 Find Missing Citations
                </button>
                <button className="w-full text-left p-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded">
                  📊 Citation Analysis
                </button>
                <button className="w-full text-left p-2 text-sm text-indigo-700 hover:bg-indigo-100 rounded">
                  📤 Export to RefMan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Citation Search */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Search & Discovery</h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search citations by title, author, or keyword..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Types</option>
              <option>Journal Articles</option>
              <option>Books</option>
              <option>Conference Papers</option>
              <option>Web Sources</option>
            </select>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Quick Add</h4>
              <p className="text-sm text-gray-600 mb-3">Add citation by DOI, ISBN, or URL</p>
              <input
                type="text"
                placeholder="Enter DOI, ISBN, or URL"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button className="w-full mt-2 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                Add Citation
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Database Search</h4>
              <p className="text-sm text-gray-600 mb-3">Search academic databases</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                  🔍 PubMed
                </button>
                <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                  📚 Google Scholar
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Import Options</h4>
              <p className="text-sm text-gray-600 mb-3">Import from reference managers</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                  📄 BibTeX File
                </button>
                <button className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                  📋 Mendeley/Zotero
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
