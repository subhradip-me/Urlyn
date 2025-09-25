import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, Plus, ArrowLeft, Target, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ExamPrepFolder() {
  const examContent = [
    { title: "Calculus Final Exam - Dec 15", type: "exam", date: "Next week", priority: "high", subject: "Math" },
    { title: "Physics Midterm Study Guide", type: "notes", date: "2 days ago", priority: "medium", subject: "Physics" },
    { title: "Chemistry Practice Tests", type: "practice", date: "1 week ago", priority: "low", subject: "Chemistry" },
    { title: "History Essay Outline", type: "notes", date: "3 days ago", priority: "medium", subject: "History" },
    { title: "Programming Quiz - Algorithms", type: "exam", date: "Tomorrow", priority: "high", subject: "CS" }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout persona="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/folders">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Folders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <FileText className="h-8 w-8 text-orange-600" />
                Exam Prep Folder
              </h1>
              <p className="text-muted-foreground">
                Finals, midterms, and exam preparation materials
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Exam Material
          </Button>
        </div>

        {/* Upcoming Exams Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Upcoming Exams</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-orange-800">Programming Quiz - Algorithms</span>
                <Badge variant="destructive">Tomorrow</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-orange-800">Calculus Final Exam</span>
                <Badge variant="default">Next week</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Notes and guides</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Total prep time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>
        </div>

        {/* Exam Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Schedule & Materials</CardTitle>
            <CardDescription>Your exam preparation timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getPriorityColor(item.priority)} text-white`}>
                      {item.type === 'exam' ? <Calendar className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">Due {item.date}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.subject}
                        </Badge>
                        <Badge variant={getPriorityBadge(item.priority)} className="text-xs capitalize">
                          {item.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      Study
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Study Schedule</CardTitle>
            <CardDescription>Your exam preparation timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="font-medium">Today: Final review for Programming Quiz</span>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="font-medium">This Week: Calculus practice problems</span>
                </div>
                <Badge variant="default">Important</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-medium">Next Week: Physics revision</span>
                </div>
                <Badge variant="secondary">Planned</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
