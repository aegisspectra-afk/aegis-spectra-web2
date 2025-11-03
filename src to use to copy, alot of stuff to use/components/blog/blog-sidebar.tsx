'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Clock, 
  Star,
  ArrowRight,
  Mail
} from 'lucide-react';
import Link from 'next/link';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  views: number;
}

export function BlogSidebar() {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, []);

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?limit=5&featured=true');
      const data = await response.json();
      setRelatedPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-aegis-teal/5 to-aegis-graphite/5 border-aegis-teal/20">
        <CardHeader>
          <CardTitle className="flex items-center text-aegis-teal">
            <Mail className="h-5 w-5 mr-2" />
            Security Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Get weekly security insights, threat alerts, and industry updates.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-aegis-teal/20"
            />
            <Button variant="aegis" size="sm" className="w-full">
              Subscribe Free
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Join 10,000+ security professionals
          </p>
        </CardContent>
      </Card>

      {/* Related Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-aegis-teal" />
            Related Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {relatedPosts.map((post) => (
                <div key={post.id} className="border-b border-border/50 pb-4 last:border-b-0">
                  <h4 className="text-sm font-medium hover:text-aegis-teal cursor-pointer transition-colors mb-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-aegis-teal" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Security', count: 12, color: '#dc2626' },
              { name: 'AI', count: 8, color: '#7c3aed' },
              { name: 'Analytics', count: 15, color: '#0f766e' },
              { name: 'Compliance', count: 6, color: '#ea580c' },
              { name: 'Cloud', count: 10, color: '#2563eb' },
              { name: 'IoT', count: 7, color: '#059669' },
              { name: 'Threats', count: 9, color: '#dc2626' },
              { name: 'Privacy', count: 5, color: '#7c3aed' }
            ].map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start h-auto p-3" asChild>
              <Link href="/blog?category=security">
                <ArrowRight className="h-4 w-4 mr-3" />
                Security Best Practices
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start h-auto p-3" asChild>
              <Link href="/blog?category=industry">
                <ArrowRight className="h-4 w-4 mr-3" />
                Industry News
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start h-auto p-3" asChild>
              <Link href="/blog?category=technology">
                <ArrowRight className="h-4 w-4 mr-3" />
                Technology Updates
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start h-auto p-3" asChild>
              <Link href="/contact">
                <ArrowRight className="h-4 w-4 mr-3" />
                Contact Our Experts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-aegis-graphite/5 to-aegis-teal/5 border-aegis-graphite/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Need Security Solutions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get a personalized security assessment for your organization.
          </p>
          <Button variant="aegis" size="sm" className="w-full" asChild>
            <Link href="/contact">
              Get Free Assessment
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}