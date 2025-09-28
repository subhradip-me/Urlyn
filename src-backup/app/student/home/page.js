import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, BookOpen, Clock, Star, TrendingUp } from "lucide-react";

export default function StudentHome() {
  return (
    <DashboardLayout persona="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Home className="h-8 w-8 text-green-600" />
              Student Home
            </h1>
            <p className="text-muted-foreground">
              Welcome to your learning dashboard
            </p>
          </div>
          <Badge variant="secondary" className="text-green-600">
            Learning Mode
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-xs text-muted-foreground">+1.2 hours from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">3 lessons completed today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Sessions</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Calculus II - Derivatives</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Machine Learning Basics</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Physics - Quantum Mechanics</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Goals</CardTitle>
              <CardDescription>Your learning objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complete Math Course</span>
                  <Badge variant="outline">75%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Certification</span>
                  <Badge variant="outline">45%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Study 5 hours daily</span>
                  <Badge variant="outline">90%</Badge>
                </div>
                <Button className="w-full mt-4">
                  View All Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start your learning session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-4">
              <Button variant="outline" className="justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Start Study Session
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Clock className="h-4 w-4" />
                Set Study Timer
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Star className="h-4 w-4" />
                Review Notes
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Track Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New achievement unlocked</p>
                <p className="text-sm text-gray-600">Completed all assignments for Math 101</p>
                <p className="text-xs text-gray-400">Published 2 days ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Upcoming exam scheduled</p>
                <p className="text-sm text-gray-600">Final exam for Physics 201</p>
                <p className="text-xs text-gray-400">Scheduled for next week</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Scholarship awarded</p>
                <p className="text-sm text-gray-600">Received merit scholarship for outstanding performance</p>
                <p className="text-xs text-gray-400">Approved 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
