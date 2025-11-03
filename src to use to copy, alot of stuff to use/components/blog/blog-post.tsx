'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  Share2, 
  Heart,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostProps {
  post: {
    id: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    publishedAt: string;
    author: {
      name: string;
      email: string;
    };
    views: number;
    tags: {
      name: string;
      color: string;
    }[];
    readingTime: number;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Track view
    fetch(`/api/blog/posts/${post.slug}/view`, { method: 'POST' });
  }, [post.id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <Badge 
              key={tag.name} 
              variant="secondary"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-6">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            {post.author.name}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readingTime} min read
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            {post.views} views
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {likes} {likes === 1 ? 'Like' : 'Likes'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge 
              key={tag.name} 
              variant="outline"
              className="cursor-pointer hover:bg-aegis-teal/10"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Author Card */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-full bg-aegis-teal/10 flex items-center justify-center">
              <User className="h-8 w-8 text-aegis-teal" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold">{post.author.name}</h4>
              <p className="text-muted-foreground mb-3">
                Security expert with 10+ years of experience in threat detection and prevention.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-aegis-teal" />
          Comments
        </h3>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No comments yet</h4>
              <p className="text-muted-foreground mb-4">
                Be the first to share your thoughts!
              </p>
              <Button variant="aegis">
                Leave a Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}