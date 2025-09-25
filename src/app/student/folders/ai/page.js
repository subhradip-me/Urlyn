import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, FileText, Video, Link as LinkIcon, Plus, ArrowLeft, Brain, Zap } from "lucide-react";
import Link from "next/link";

export default function AIFolder() {
  const aiContent = [
    { title: "Neural Network Fundamentals", type: "notes", date: "1 hour ago", tags: ["neural-networks", "basics"] },
    { title: "TensorFlow Tutorial Series", type: "video", date: "3 hours ago", tags: ["tensorflow", "tutorial"] },
    { title: "Machine Learning Coursera", type: "link", date: "Yesterday", tags: ["coursera", "ml"] },
    { title: "Deep Learning Paper", type: "document", date: "2 days ago", tags: ["research", "deep-learning"] },
    { title: "Python for AI - Code Examples", type: "notes", date: "3 days ago", tags: ["python", "coding"] }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'notes': return FileText;
      case 'video': return Video;
      case 'link': return LinkIcon;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'notes': return 'bg-purple-500';
      case 'video': return 'bg-red-500';
      case 'link': return 'bg-green-500';
      case 'document': return 'bg-blue-500';
      default: return 'bg-gray-500';
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
                <Cpu className="h-8 w-8 text-purple-600" />
                AI Folder
              </h1>
              <p className="text-muted-foreground">
                Machine Learning and Artificial Intelligence resources
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add AI Resource
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">ML resources</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Academic papers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Tutorials</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Learning videos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Code Examples</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Practical code</p>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Materials</CardTitle>
            <CardDescription>Your artificial intelligence study resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiContent.map((item, index) => {
                const Icon = getIcon(item.type);
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getColor(item.type)} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Added {item.date}</p>
                        <div className="flex gap-1 mt-1">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        Open
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Learning Path */}
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Path</CardTitle>
            <CardDescription>Suggested progression through your AI materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">✓</div>
                <span className="text-sm">Basic Machine Learning Concepts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">2</div>
                <span className="text-sm font-medium">Neural Network Fundamentals (Current)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
                <span className="text-sm text-muted-foreground">Deep Learning Advanced Topics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">4</div>
                <span className="text-sm text-muted-foreground">AI Ethics and Applications</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
