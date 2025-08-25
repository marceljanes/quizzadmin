'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/lib/supabase';
import { 
  BookOpen, 
  HelpCircle, 
  FolderOpen, 
  TrendingUp,
  Activity,
  Star,
  Eye,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

interface DashboardStats {
  totalExams: number;
  totalQuestions: number;
  totalCategories: number;
  totalCompetitors: number;
  activeExams: number;
  featuredExams: number;
}

const StatCard = ({ icon: Icon, title, value, subtitle, color }: {
  icon: any;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}) => (
  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 hover:border-zinc-600 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-400 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-zinc-300" />
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ icon: Icon, title, description, onClick, color }: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}) => (
  <div 
    onClick={onClick}
    className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors cursor-pointer"
  >
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-md ${color}`}>
        <Icon className="h-4 w-4 text-zinc-300" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setError(null);
      console.log('Loading dashboard stats...');
      const data = await dbService.getDashboardStats();
      console.log('Stats loaded successfully:', data);
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border border-zinc-600 border-t-white mx-auto mb-4"></div>
          <p className="text-sm text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-zinc-900 border border-red-700 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-medium text-red-400 mb-2">Connection Error</h2>
            <p className="text-sm text-red-300 mb-4">{error}</p>
            <button 
              onClick={loadDashboardStats}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-medium text-white">EF Admin Dashboard</h1>
              <p className="text-sm text-zinc-400">Exam Management System</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Insert</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-6">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'exams', name: 'Exams', icon: BookOpen },
              { id: 'questions', name: 'Questions', icon: HelpCircle },
              { id: 'categories', name: 'Categories', icon: FolderOpen },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard
                icon={BookOpen}
                title="Total Exams"
                value={stats?.totalExams || 0}
                subtitle={`${stats?.activeExams || 0} active`}
                color="bg-zinc-700"
              />
              <StatCard
                icon={HelpCircle}
                title="Total Questions"
                value={stats?.totalQuestions || 0}
                color="bg-zinc-700"
              />
              <StatCard
                icon={FolderOpen}
                title="Categories"
                value={stats?.totalCategories || 0}
                color="bg-zinc-700"
              />
              <StatCard
                icon={TrendingUp}
                title="Competitor Analysis"
                value={stats?.totalCompetitors || 0}
                color="bg-zinc-700"
              />
              <StatCard
                icon={Star}
                title="Featured Exams"
                value={stats?.featuredExams || 0}
                color="bg-zinc-700"
              />
              <StatCard
                icon={Eye}
                title="Active Exams"
                value={stats?.activeExams || 0}
                subtitle="Live on platform"
                color="bg-zinc-700"
              />
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <QuickActionCard
                  icon={Plus}
                  title="Create New Exam"
                  description="Add a new exam with questions and categories"
                  onClick={() => setActiveTab('exams')}
                  color="bg-zinc-700"
                />
                <QuickActionCard
                  icon={HelpCircle}
                  title="Add Questions"
                  description="Create new questions for existing exams"
                  onClick={() => setActiveTab('questions')}
                  color="bg-zinc-700"
                />
                <QuickActionCard
                  icon={TrendingUp}
                  title="View Analytics"
                  description="Check exam performance and competitor analysis"
                  onClick={() => setActiveTab('analytics')}
                  color="bg-zinc-700"
                />
                <QuickActionCard
                  icon={FolderOpen}
                  title="Manage Categories"
                  description="Organize questions into categories"
                  onClick={() => setActiveTab('categories')}
                  color="bg-zinc-700"
                />
                <QuickActionCard
                  icon={Search}
                  title="Search Content"
                  description="Find specific exams, questions, or data"
                  onClick={() => {}}
                  color="bg-zinc-700"
                />
                <QuickActionCard
                  icon={Filter}
                  title="Bulk Operations"
                  description="Perform bulk updates and maintenance"
                  onClick={() => {}}
                  color="bg-zinc-700"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
              <div className="bg-zinc-900 border border-zinc-700 rounded-lg">
                <div className="p-4">
                  <div className="space-y-3">
                    {[
                      {
                        action: 'Dashboard loaded successfully',
                        target: `${stats?.totalExams || 0} exams, ${stats?.totalQuestions || 0} questions`,
                        time: 'Just now',
                        type: 'success'
                      },
                      {
                        action: 'System ready',
                        target: 'All services operational',
                        time: '1 minute ago',
                        type: 'info'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-700 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'info' ? 'bg-blue-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-zinc-500'
                          }`}></div>
                          <div>
                            <p className="text-sm text-white">{activity.action}</p>
                            <p className="text-xs text-zinc-400">{activity.target}</p>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-500">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content will be added in separate components */}
        {activeTab !== 'overview' && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-white mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p className="text-zinc-400">This section is under development. Coming soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
