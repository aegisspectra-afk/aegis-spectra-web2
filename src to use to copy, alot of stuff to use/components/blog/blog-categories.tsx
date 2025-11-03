'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  TrendingUp, 
  Settings, 
  Users, 
  AlertTriangle, 
  Camera,
  BarChart3,
  Lock,
  BookOpen,
  Newspaper
} from 'lucide-react';
import { getBlogPosts, getCategories, getTags } from '@/lib/blog-posts';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
  icon: string;
}

const categoryIcons: Record<string, any> = {
  'מדריכים': BookOpen,
  'טיפים': TrendingUp,
  'טכנולוגיה': Settings,
  'חדשות': Newspaper,
  'אבטחה': Shield,
  'מצלמות': Camera,
  'עסקים': BarChart3,
  'פרטיות': Lock
};

export function BlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    try {
      // Get categories with post counts
      const allCategories = getCategories();
      const categoriesWithCounts = allCategories.map(category => {
        const posts = getBlogPosts({ category });
        return {
          id: category.toLowerCase(),
          name: category,
          slug: category.toLowerCase(),
          color: '#0f766e', // aegis-teal
          postCount: posts.length,
          icon: category
        };
      });
      
      setCategories(categoriesWithCounts);
      
      // Get tags
      const allTags = getTags();
      setTags(allTags);
      
      // Get recent posts
      const recent = getBlogPosts({ limit: 4 });
      setRecentPosts(recent);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="bg-gradient-to-br from-aegis-teal/5 to-aegis-blue/5 border-aegis-teal/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-aegis-teal">
            <Shield className="h-5 w-5 ml-2" />
            קטגוריות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.icon] || Shield;
              const colors = [
                'from-red-500 to-pink-500',
                'from-blue-500 to-cyan-500', 
                'from-green-500 to-emerald-500',
                'from-purple-500 to-violet-500',
                'from-orange-500 to-yellow-500',
                'from-indigo-500 to-blue-500'
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-gradient-to-r hover:from-aegis-teal/10 hover:to-aegis-blue/10 transition-all duration-300"
                  asChild
                >
                  <a href={`/blog?category=${category.slug}`}>
                    <div className="flex items-center w-full">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} ml-3`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="flex-1 text-right font-medium">{category.name}</span>
                      <Badge 
                        variant="secondary" 
                        className="mr-2 bg-gradient-to-r from-aegis-teal/20 to-aegis-blue/20 text-aegis-teal border-aegis-teal/30"
                      >
                        {category.postCount}
                      </Badge>
                    </div>
                  </a>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="bg-gradient-to-br from-aegis-blue/5 to-purple-500/5 border-aegis-blue/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-aegis-blue">
            <TrendingUp className="h-5 w-5 ml-2" />
            תגיות פופולריות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag, index) => {
              const gradientClasses = [
                'bg-gradient-to-r from-red-500 to-pink-500',
                'bg-gradient-to-r from-blue-500 to-cyan-500',
                'bg-gradient-to-r from-green-500 to-emerald-500',
                'bg-gradient-to-r from-purple-500 to-violet-500',
                'bg-gradient-to-r from-orange-500 to-yellow-500',
                'bg-gradient-to-r from-indigo-500 to-blue-500',
                'bg-gradient-to-r from-pink-500 to-rose-500',
                'bg-gradient-to-r from-teal-500 to-cyan-500'
              ];
              const gradientClass = gradientClasses[index % gradientClasses.length];
              
              return (
                <Badge
                  key={tag}
                  className={`cursor-pointer hover:scale-105 transition-all duration-300 text-white border-0 ${gradientClass} shadow-lg hover:shadow-xl`}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-aegis-teal/5 to-aegis-graphite/5 border-aegis-teal/20">
        <CardHeader>
          <CardTitle className="flex items-center text-aegis-teal">
            <Settings className="h-5 w-5 ml-2" />
            הישאר מעודכן
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            קבל את הטיפים והמדריכים החדשים ביותר ישירות לתיבת הדואר שלך.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="הכנס את האימייל שלך"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-aegis-teal/20"
            />
            <Button variant="aegis" size="sm" className="w-full">
              הירשם
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-green-600">
            <BarChart3 className="h-5 w-5 ml-2" />
            פוסטים אחרונים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentPosts.map((post, index) => (
              <div key={post.id} className="border-b border-green-500/20 pb-3 last:border-b-0 hover:bg-green-500/5 p-2 rounded-lg transition-colors">
                <h4 className="text-sm font-medium hover:text-green-600 cursor-pointer transition-colors text-right">
                  <a href={`/blog/${post.slug}`}>
                    {post.title}
                  </a>
                </h4>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}