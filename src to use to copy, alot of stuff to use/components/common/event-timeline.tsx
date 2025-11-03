'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Camera, 
  User, 
  Shield,
  Filter,
  Calendar,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'security' | 'system' | 'user' | 'camera' | 'alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  metadata?: Record<string, any>;
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: '2025-01-15T14:30:00Z',
    type: 'security',
    severity: 'critical',
    title: 'Malware Detected',
    description: 'Trojan horse detected in downloaded file',
    source: 'Antivirus Scanner',
    metadata: { file: 'suspicious.exe', hash: 'abc123...' }
  },
  {
    id: '2',
    timestamp: '2025-01-15T14:25:00Z',
    type: 'camera',
    severity: 'medium',
    title: 'Motion Detected',
    description: 'Unusual movement detected in parking area',
    source: 'Camera 02 - Parking Lot',
    metadata: { camera: 'cam-02', confidence: 0.87 }
  },
  {
    id: '3',
    timestamp: '2025-01-15T14:20:00Z',
    type: 'user',
    severity: 'low',
    title: 'User Login',
    description: 'John Doe logged in from 192.168.1.100',
    source: 'Authentication System',
    metadata: { user: 'john.doe', ip: '192.168.1.100' }
  },
  {
    id: '4',
    timestamp: '2025-01-15T14:15:00Z',
    type: 'system',
    severity: 'medium',
    title: 'High CPU Usage',
    description: 'CPU usage exceeded 90% for 5 minutes',
    source: 'System Monitor',
    metadata: { cpu: 92, duration: '5m' }
  },
  {
    id: '5',
    timestamp: '2025-01-15T14:10:00Z',
    type: 'alert',
    severity: 'high',
    title: 'Network Intrusion Attempt',
    description: 'Suspicious network activity from external IP',
    source: 'Network IDS',
    metadata: { ip: '203.0.113.1', port: 22 }
  },
  {
    id: '6',
    timestamp: '2025-01-15T14:05:00Z',
    type: 'camera',
    severity: 'low',
    title: 'Camera Status Change',
    description: 'Camera 01 - Main Entrance came online',
    source: 'Camera System',
    metadata: { camera: 'cam-01', status: 'online' }
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'security': return <Shield className="h-4 w-4" />;
    case 'system': return <Info className="h-4 w-4" />;
    case 'user': return <User className="h-4 w-4" />;
    case 'camera': return <Camera className="h-4 w-4" />;
    case 'alert': return <AlertTriangle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-100 border-red-200';
    case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-100 border-green-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical': return <XCircle className="h-4 w-4" />;
    case 'high': return <AlertTriangle className="h-4 w-4" />;
    case 'medium': return <Info className="h-4 w-4" />;
    case 'low': return <CheckCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

interface EventTimelineProps {
  events?: TimelineEvent[];
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function EventTimeline({ 
  events = mockEvents, 
  autoRefresh = true, 
  refreshInterval = 5000 
}: EventTimelineProps) {
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>(events);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState({
    type: 'all',
    severity: 'all',
    search: ''
  });

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // In a real app, this would fetch new events from the API
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Filter events based on current filters
  useEffect(() => {
    let filtered = events;

    if (filters.type !== 'all') {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(event => event.severity === filters.severity);
    }

    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.source.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTime(new Date());
    setIsPlaying(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Event Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="flex-1 min-w-48"
          />
          
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="camera">Camera</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.severity}
            onValueChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  {/* Timeline line */}
                  {index < filteredEvents.length - 1 && (
                    <div className="absolute left-6 top-8 w-0.5 h-16 bg-border" />
                  )}
                  
                  {/* Event icon */}
                  <div className={`p-2 rounded-full border-2 ${getSeverityColor(event.severity)}`}>
                    {getSeverityIcon(event.severity)}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(event.severity)}`}
                        >
                          {event.severity}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(event.type)}
                        <span>{event.source}</span>
                      </div>
                      
                      {event.metadata && (
                        <div className="flex items-center gap-2">
                          {Object.entries(event.metadata).map(([key, value]) => (
                            <span key={key} className="bg-muted px-2 py-1 rounded">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No events found matching your filters</p>
            </div>
          )}
        </div>
        
        {/* Timeline controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {events.length} events
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Export Timeline
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Set Time Range
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}