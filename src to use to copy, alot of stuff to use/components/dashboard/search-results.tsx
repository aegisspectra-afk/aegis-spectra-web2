'use client';

import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Camera, 
  AlertTriangle, 
  Eye, 
  Download, 
  Share2,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

export interface SearchResult {
  id: string;
  timestamp: Date;
  camera: {
    id: string;
    name: string;
    location: string;
    thumbnail?: string;
  };
  event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    confidence: number;
  };
  status: 'active' | 'resolved' | 'investigating' | 'false_positive';
  metadata?: {
    duration?: number;
    objects?: string[];
    coordinates?: { x: number; y: number; width: number; height: number };
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  totalCount?: number;
  onViewDetails: (result: SearchResult) => void;
  onExport: (result: SearchResult) => void;
  onShare: (result: SearchResult) => void;
  onStatusChange: (resultId: string, status: string) => void;
}

export function SearchResults({ 
  results, 
  isLoading = false, 
  totalCount = 0,
  onViewDetails,
  onExport,
  onShare,
  onStatusChange
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    false_positive: 'bg-gray-100 text-gray-800',
  };

  const eventTypeIcons = {
    motion: 'activity',
    intrusion: 'shield-alert',
    fire: 'flame',
    smoke: 'cloud',
    person: 'user',
    vehicle: 'car',
    object: 'package',
  };

  const sortedResults = [...results].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'timestamp':
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
        break;
      case 'severity':
        const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = severityOrder[a.event.severity];
        bValue = severityOrder[b.event.severity];
        break;
      case 'camera':
        aValue = a.camera.name;
        bValue = b.camera.name;
        break;
      case 'confidence':
        aValue = a.event.confidence;
        bValue = b.event.confidence;
        break;
      default:
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aegis-teal"></div>
            <span className="ml-2">Searching...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            Search Results ({totalCount.toLocaleString()})
          </h3>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Date</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="camera">Camera</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
      )}>
        {sortedResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {viewMode === 'list' ? (
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    {result.camera.thumbnail ? (
                      <img 
                        src={result.camera.thumbnail} 
                        alt={result.camera.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <Badge 
                      className={cn(
                        "absolute top-1 right-1 text-xs",
                        severityColors[result.event.severity]
                      )}
                    >
                      {result.event.severity}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {eventTypeIcons[result.event.type as keyof typeof eventTypeIcons] || 'camera'}
                          </span>
                          <h4 className="font-medium truncate">
                            {result.camera.name}
                          </h4>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {result.event.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(result.timestamp, 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(result.timestamp, 'HH:mm:ss')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {result.camera.location}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={statusColors[result.status]}
                        >
                          {result.status.replace('_', ' ')}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDetails(result)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExport(result)}>
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onShare(result)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onStatusChange(result.id, 'resolved')}>
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(result.id, 'false_positive')}>
                              Mark as False Positive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Grid View
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                    {result.camera.thumbnail ? (
                      <img 
                        src={result.camera.thumbnail} 
                        alt={result.camera.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <Badge 
                      className={cn(
                        "absolute top-2 right-2 text-xs",
                        severityColors[result.event.severity]
                      )}
                    >
                      {result.event.severity}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {eventTypeIcons[result.event.type as keyof typeof eventTypeIcons] || 'camera'}
                      </span>
                      <h4 className="font-medium truncate">
                        {result.camera.name}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.event.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={statusColors[result.status]}
                      >
                        {result.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className="text-xs text-muted-foreground">
                        {format(result.timestamp, 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}