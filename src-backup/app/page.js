"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Camera, ArrowRight, Sparkles, Target, TrendingUp, CheckCircle, Star, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useOptimizedRouter from "@/hooks/useOptimizedRouter";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { navigateInstant, prefetchRoute } = useOptimizedRouter();

  // Prefetch important routes for instant navigation
  useEffect(() => {
    prefetchRoute('/dashboard');
    prefetchRoute('/login');
    prefetchRoute('/register');
  }, [prefetchRoute]);

  // Optimized redirect - only redirect if definitely authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigateInstant('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigateInstant]);
  const features = [
    {
      icon: GraduationCap,
      title: "Student Hub",
      description: "Organize study materials, take AI-powered notes, and collaborate with peers",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Briefcase,
      title: "Work Hub", 
      description: "Manage projects, track progress, and collaborate with your team",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Camera,
      title: "Creator Hub",
      description: "Plan content, write scripts, and manage your creative workflow",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    }
  ];

  const benefits = [
    "AI-powered note taking and organization",
    "Collaborative workspaces for teams",
    "Cross-platform sync and access",
    "Smart content categorization",
    "Advanced analytics and insights",
    "Seamless workflow integration"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "This platform revolutionized how I study. The AI notes feature helps me understand complex concepts faster.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Project Manager",
      content: "Our team's productivity increased by 40% since we started using the Work Hub. Collaboration has never been easier.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Content Creator",
      content: "The Creator Hub streamlined my content workflow. I can plan, write, and publish all from one place.",
      avatar: "ET"
    }
  ];

  // Show loading state immediately if auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            UrLyn 2.0
          </div>
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UrLyn 2.0
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              ) : isAuthenticated ? (
                <Button variant="outline" onClick={() => navigateInstant('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigateInstant('/login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigateInstant('/register')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Productivity Platform
          </Badge>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Your All-in-One Workspace for 
            <span className="block">Learning, Working & Creating</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Whether you're a student, professional, or creator, UrLyn 2.0 adapts to your needs with 
            AI-powered tools, seamless collaboration, and intelligent organization.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigateInstant('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigateInstant('/register')}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigateInstant('/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Three Powerful Hubs, One Platform</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your persona and unlock tools specifically designed for your workflow
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose UrLyn 2.0?</h2>
              <p className="text-gray-600 mb-8">
                Experience the next generation of productivity tools designed to enhance your learning, 
                working, and creative processes with cutting-edge AI assistance.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-2">
              <Card className="p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">User Satisfaction</div>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">40%</div>
                <div className="text-sm text-gray-600">Productivity Boost</div>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </Card>
              <Card className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">4.9</div>
                <div className="text-sm text-gray-600">App Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600">Real feedback from students, professionals, and creators</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their learning, working, and creative processes
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigateInstant('/register')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">UrLyn 2.0</span>
              </div>
              <p className="text-gray-400">
                The ultimate productivity platform for modern learners, workers, and creators.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UrLyn 2.0. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
