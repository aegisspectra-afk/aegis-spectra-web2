'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, ArrowRight, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, type BlogPost } from '@/lib/blog-posts';

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allPosts = getBlogPosts({ limit: page * 6 });
      const newPosts = allPosts.slice((page - 1) * 6, page * 6);
      
      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMore(allPosts.length > page * 6);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">לא נמצאו פוסטים</h3>
        <p className="text-muted-foreground">חזור מאוחר יותר לתוכן חדש!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => {
          const gradientClasses = [
            'from-red-500/10 to-pink-500/10 border-red-500/20',
            'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
            'from-green-500/10 to-emerald-500/10 border-green-500/20',
            'from-purple-500/10 to-violet-500/10 border-purple-500/20',
            'from-orange-500/10 to-yellow-500/10 border-orange-500/20',
            'from-indigo-500/10 to-blue-500/10 border-indigo-500/20'
          ];
          const cardGradient = gradientClasses[index % gradientClasses.length];
          
          return (
            <Card key={post.id} className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br ${cardGradient} hover:scale-105`}>
              {/* Cover Image */}
              <div className="aspect-video bg-muted/30 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-aegis-secondary text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-aegis-teal/20 to-aegis-blue/20 rounded-full flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-aegis-teal" />
                    </div>
                    <div className="text-sm">תמונה: {post.title}</div>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => {
                    const tagGradients = [
                      'bg-gradient-to-r from-red-500 to-pink-500',
                      'bg-gradient-to-r from-blue-500 to-cyan-500',
                      'bg-gradient-to-r from-green-500 to-emerald-500'
                    ];
                    const tagGradient = tagGradients[tagIndex % tagGradients.length];
                    
                    return (
                      <Badge 
                        key={tag} 
                        className={`text-white border-0 text-xs shadow-md ${tagGradient}`}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
                
                <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-aegis-teal transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                
                <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-aegis-teal" />
                      {post.author.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-aegis-blue" />
                      {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-green-500" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      {post.readTime} דק׳
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={loadMore} 
            variant="aegis" 
            size="lg"
            disabled={loading}
            className="bg-gradient-to-r from-aegis-teal to-aegis-blue hover:from-aegis-blue hover:to-aegis-teal shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                טוען...
              </>
            ) : (
              'טען עוד פוסטים'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}