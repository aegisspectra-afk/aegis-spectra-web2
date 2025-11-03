'use client';

import { useState, useEffect } from 'react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  Camera, 
  AlertTriangle,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';

interface SearchFilters {
  query: string;
  type: string;
  severity: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  camera: string;
  status: string;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  camera?: {
    name: string;
    location: string;
  };
  user?: {
    name: string;
    email: string;
  };
  metadata: any;
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    severity: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    },
    camera: 'all',
    status: 'all'
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const searchTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'events', label: 'Security Events' },
    { value: 'cameras', label: 'Cameras' },
    { value: 'users', label: 'Users' },
    { value: 'reports', label: 'Reports' },
    { value: 'alerts', label: 'Alerts' }
  ];

  const severityLevels = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleSearch = async () => {
    if (!filters.query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'events',
          title: 'Motion Detected',
          description: 'Motion detected at main entrance camera',
          severity: 'medium',
          timestamp: new Date().toISOString(),
          camera: {
            name: 'Main Entrance',
            location: 'Building A - Main Entrance'
          },
          metadata: { confidence: 0.85 }
        },
        {
          id: '2',
          type: 'cameras',
          title: 'Camera Offline',
          description: 'Parking lot camera went offline',
          severity: 'high',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          camera: {
            name: 'Parking Lot',
            location: 'Building A - Parking Area'
          },
          metadata: { lastSeen: new Date(Date.now() - 3600000).toISOString() }
        },
        {
          id: '3',
          type: 'users',
          title: 'User Login',
          description: 'Admin user logged in from new location',
          severity: 'low',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: {
            name: 'Admin User',
            email: 'admin@aegis-spectra.com'
          },
          metadata: { ip: '192.168.1.100' }
        }
      ];

      setResults(mockResults);
      toast.success(`Found ${mockResults.length} results`);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'events':
        return <AlertTriangle className="h-4 w-4" />;
      case 'cameras':
        return <Camera className="h-4 w-4" />;
      case 'users':
        return <User className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <PanelLayout userRole="ADMIN" subscriptionPlan="PRO">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold">Search</h1>
          <p className="text-muted-foreground">
            Search across all system data and events
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search events, cameras, users, reports..."
                  value={filters.query}
                  onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} variant="aegis">
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button 
                onClick={() => setShowFilters(!showFilters)} 
                variant="outline"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {searchTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select value={filters.severity} onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Camera</label>
                    <Select value={filters.camera} onValueChange={(value) => setFilters(prev => ({ ...prev, camera: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cameras</SelectItem>
                        <SelectItem value="main-entrance">Main Entrance</SelectItem>
                        <SelectItem value="parking-lot">Parking Lot</SelectItem>
                        <SelectItem value="loading-dock">Loading Dock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          {results.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Search Results ({results.length})
              </h2>
              <Button variant="outline" size="sm">
                Export Results
              </Button>
            </div>
          )}

          {results.length === 0 && !loading && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No search results</h3>
                <p className="text-muted-foreground">
                  Enter a search query to find events, cameras, users, and more.
                </p>
              </CardContent>
            </Card>
          )}

          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(result.type)}
                      <h3 className="text-lg font-semibold">{result.title}</h3>
                      <Badge className={getSeverityColor(result.severity)}>
                        {result.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{result.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                      
                      {result.camera && (
                        <div className="flex items-center">
                          <Camera className="h-4 w-4 mr-1" />
                          {result.camera.name}
                        </div>
                      )}
                      
                      {result.user && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {result.user.name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PanelLayout>
  );
}