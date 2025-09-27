'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ArrowRight, Plus, Users, BookOpen, TrendingUp, Activity, Bookmark, FileText, Camera, Briefcase, Rocket, FlaskConical } from 'lucide-react';

const PersonaCard = ({ persona, isActive, onSelect, onAdd, hasAccess }) => {
  const icons = {
    student: GraduationCap,
    professional: Briefcase,
    creator: Camera,
    entrepreneur: Rocket,
    researcher: FlaskConical
  };

  const colors = {
    student: 'bg-green-50 border-green-200 text-green-900',
    professional: 'bg-blue-50 border-blue-200 text-blue-900',
    creator: 'bg-purple-50 border-purple-200 text-purple-900',
    entrepreneur: 'bg-orange-50 border-orange-200 text-orange-900',
    researcher: 'bg-teal-50 border-teal-200 text-teal-900'
  };

  const descriptions = {
    student: 'Access learning materials, take notes, organize assignments, and track your academic progress.',
    professional: 'Manage work projects, collaborate with team members, track deadlines, and organize professional resources.',
    creator: 'Organize content ideas, manage creative projects, track inspiration, and collaborate with other creators.',
    entrepreneur: 'Manage business ventures, track investments, network with partners, and monitor market opportunities.',
    researcher: 'Organize research papers, manage citations, collaborate on studies, and track academic progress.'
  };

  const features = {
    student: ['📚 Course Management', '📝 Note Taking', '📋 Assignment Tracking', '🔖 Bookmarks'],
    professional: ['💼 Project Management', '👥 Team Collaboration', '📊 Analytics', '🔗 Resource Organization'],
    creator: ['🎨 Content Planning', '💡 Idea Management', '📱 Social Analytics', '🤝 Creator Network'],
    entrepreneur: ['🚀 Business Planning', '💰 Investment Tracking', '🤝 Partnership Network', '📈 Market Research'],
    researcher: ['📖 Literature Review', '📊 Data Management', '👥 Research Collaboration', '📝 Citation Tracking']
  };

  const Icon = icons[persona];

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${hasAccess ? '' : 'opacity-75'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${colors[persona]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="capitalize text-lg">{persona}</CardTitle>
              {isActive && <Badge variant="secondary" className="mt-1">Active</Badge>}
            </div>
          </div>
          {hasAccess ? (
            <Button
              onClick={() => onSelect(persona)}
              variant={isActive ? "secondary" : "default"}
              size="sm"
            >
              {isActive ? 'Current' : 'Switch'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => onAdd(persona)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{descriptions[persona]}</p>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900">Key Features:</h4>
          <div className="grid grid-cols-2 gap-1">
            {features[persona].map((feature, index) => (
              <div key={index} className="text-sm text-gray-600">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { user, switchPersona, addPersona, loading } = useAuth();
  const router = useRouter();
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState(null);
  const [quickActions, setQuickActions] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);
  
  // Handle redirect to login when not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('Dashboard: No user found, redirecting to login');
      router.push('/login');
    }
  }, [loading, user, router]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Load dashboard stats when user is available
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setIsLoadingStats(true);
      setStatsError(null);
      
      try {
        const [statsResponse, actionsResponse] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getQuickActions()
        ]);
        
        setDashboardStats(statsResponse.data);
        setQuickActions(actionsResponse.data.actions || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setStatsError(error.message);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadDashboardData();
  }, [user]);

  useEffect(() => {
    // Handle redirects in useEffect to avoid setState during render
    console.log('Dashboard useEffect - user:', user, 'loading:', loading);
    
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log('Dashboard: No user, redirecting to login');
      router.push('/login');
      return;
    }
    
    // Only redirect if we have a user, not loading, and they have a current persona
    // Commenting out auto-redirect for debugging
    /*
    if (!loading && user && user.currentPersona && user.personas && user.personas.includes(user.currentPersona) && !hasRedirected) {
      setHasRedirected(true);
      console.log('Redirecting to persona home:', user.currentPersona);
      router.push(`/${user.currentPersona}/home`);
    }
    */
  }, [user, loading, router, hasRedirected]);

  const handlePersonaSelect = async (persona) => {
    if (!user.personas.includes(persona)) return;
    
    setIsLoading(true);
    try {
      await switchPersona(persona);
      router.push(`/${persona}/home`);
    } catch (error) {
      console.error('Error switching persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaAdd = async (persona) => {
    setIsLoading(true);
    try {
      await addPersona(persona);
      // After adding, automatically switch to it and redirect
      await switchPersona(persona);
      router.push(`/${persona}/home`);
    } catch (error) {
      console.error('Error adding persona:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    console.log('Dashboard: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: No user, showing loading while redirecting...');
    // Show loading state while redirect happens in useEffect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  console.log('Dashboard: User loaded', { user, loading });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Urlyn, {user.firstName}!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your persona to access tailored features and experiences. 
            You can switch between personas at any time or add new ones as needed.
          </p>
        </div>

        {/* User Stats */}
        {user.personas && user.personas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : (dashboardStats?.stats?.totalPersonas || user.personas.length)}
                </div>
                <div className="text-sm text-gray-600">Active Personas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Bookmark className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : (dashboardStats?.stats?.totalBookmarks || '0')}
                </div>
                <div className="text-sm text-gray-600">Total Bookmarks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {isLoadingStats ? '...' : (dashboardStats?.stats?.totalTags || '0')}
                </div>
                <div className="text-sm text-gray-600">Total Tags</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Persona-specific Stats */}
        {dashboardStats && !isLoadingStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {user.currentPersona === 'student' && (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.totalNotes || 0}</div>
                    <div className="text-xs text-gray-600">Notes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.totalCourses || 0}</div>
                    <div className="text-xs text-gray-600">Courses</div>
                  </CardContent>
                </Card>
              </>
            )}
            {user.currentPersona === 'creator' && (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Camera className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.totalContent || 0}</div>
                    <div className="text-xs text-gray-600">Content</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.publishedContent || 0}</div>
                    <div className="text-xs text-gray-600">Published</div>
                  </CardContent>
                </Card>
              </>
            )}
            {user.currentPersona === 'professional' && (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Briefcase className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.totalProjects || 0}</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold">{dashboardStats.stats.activeProjects || 0}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </CardContent>
                </Card>
              </>
            )}
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  {dashboardStats?.user?.createdAt ? new Date(dashboardStats.user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Member Since</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Persona Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {!user.personas || user.personas.length === 0 ? 'Choose Your First Persona' : 'Manage Your Personas'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {['student', 'professional', 'creator', 'entrepreneur', 'researcher'].map((persona) => (
              <PersonaCard
                key={persona}
                persona={persona}
                isActive={user.currentPersona === persona}
                hasAccess={user.personas && user.personas.includes(persona)}
                onSelect={handlePersonaSelect}
                onAdd={handlePersonaAdd}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {user.personas && user.personas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quick Actions for {user.currentPersona}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading actions...</p>
                </div>
              ) : quickActions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => router.push(action.path)}
                      disabled={isLoading}
                    >
                      <div className={`w-6 h-6 text-${action.color}-600`}>
                        {action.icon === 'bookmark' && <Bookmark className="w-6 h-6" />}
                        {action.icon === 'note' && <FileText className="w-6 h-6" />}
                        {action.icon === 'folder' && <BookOpen className="w-6 h-6" />}
                        {action.icon === 'create' && <Camera className="w-6 h-6" />}
                        {action.icon === 'chart' && <TrendingUp className="w-6 h-6" />}
                        {action.icon === 'project' && <Briefcase className="w-6 h-6" />}
                        {action.icon === 'team' && <Users className="w-6 h-6" />}
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.personas.map((persona) => (
                    <Button
                      key={persona}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => handlePersonaSelect(persona)}
                      disabled={isLoading}
                    >
                      {persona === 'student' && <GraduationCap className="w-6 h-6" />}
                      {persona === 'creator' && <Camera className="w-6 h-6" />}
                      {persona === 'professional' && <Briefcase className="w-6 h-6" />}
                      <span className="capitalize">Go to {persona}</span>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {statsError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-red-800">
                <strong>Error loading dashboard data:</strong> {statsError}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? You can always switch personas later from the sidebar in any dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
