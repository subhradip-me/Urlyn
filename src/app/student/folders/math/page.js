import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, Video, Link as LinkIcon, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MathFolder() {
  const mathContent = [
    { title: "Calculus Derivatives", type: "notes", date: "2 hours ago", tags: ["calculus", "derivatives"] },
    { title: "Integration Techniques", type: "video", date: "Yesterday", tags: ["calculus", "integration"] },
    { title: "Khan Academy - Limits", type: "link", date: "2 days ago", tags: ["limits", "khan"] },
    { title: "Linear Algebra Basics", type: "notes", date: "3 days ago", tags: ["linear", "vectors"] },
    { title: "Statistics Formula Sheet", type: "document", date: "1 week ago", tags: ["statistics", "formulas"] }
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
      case 'notes': return 'bg-blue-500';
      case 'video': return 'bg-red-500';
      case 'link': return 'bg-green-500';
      case 'document': return 'bg-purple-500';
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
                <Book className="h-8 w-8 text-blue-600" />
                Math Folder
              </h1>
              <p className="text-muted-foreground">
                Calculus, Algebra, and Statistics materials
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Notes, videos, links</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Personal notes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Lectures</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Saved videos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">External Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">Bookmarked resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Math Content</CardTitle>
            <CardDescription>Your saved math study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mathContent.map((item, index) => {
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for this folder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-4">
              <Button variant="outline" className="justify-start gap-2">
                <FileText className="h-4 w-4" />
                Create Note
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Video className="h-4 w-4" />
                Add Video
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <LinkIcon className="h-4 w-4" />
                Save Link
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <Book className="h-4 w-4" />
                Study Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
