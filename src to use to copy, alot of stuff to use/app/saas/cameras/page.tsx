'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Camera, 
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Wifi,
  WifiOff,
  Video,
  Play,
  Pause,
  MoreVertical,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function CamerasPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for cameras
  const cameras = [
    { 
      id: 1, 
      name: 'Front Door Camera', 
      status: 'online', 
      location: 'Main Entrance', 
      lastSeen: '2 min ago', 
      isRecording: true,
      resolution: '1080p',
      type: 'IP Camera',
      model: 'Aegis Pro X1'
    },
    { 
      id: 2, 
      name: 'Backyard Monitor', 
      status: 'online', 
      location: 'Garden Area', 
      lastSeen: '1 min ago', 
      isRecording: true,
      resolution: '4K',
      type: 'IP Camera',
      model: 'Aegis Ultra X2'
    },
    { 
      id: 3, 
      name: 'Garage Security', 
      status: 'offline', 
      location: 'Parking Garage', 
      lastSeen: '1 hour ago', 
      isRecording: false,
      resolution: '720p',
      type: 'Analog Camera',
      model: 'Aegis Basic B1'
    },
    { 
      id: 4, 
      name: 'Living Room Cam', 
      status: 'online', 
      location: 'Interior', 
      lastSeen: '30 sec ago', 
      isRecording: true,
      resolution: '1080p',
      type: 'IP Camera',
      model: 'Aegis Pro X1'
    },
    { 
      id: 5, 
      name: 'Kitchen Monitor', 
      status: 'online', 
      location: 'Kitchen', 
      lastSeen: '5 min ago', 
      isRecording: false,
      resolution: '720p',
      type: 'IP Camera',
      model: 'Aegis Basic B1'
    },
    { 
      id: 6, 
      name: 'Office Security', 
      status: 'maintenance', 
      location: 'Home Office', 
      lastSeen: '2 hours ago', 
      isRecording: false,
      resolution: '1080p',
      type: 'IP Camera',
      model: 'Aegis Pro X1'
    },
  ];

  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camera.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || camera.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge variant="default">Online</Badge>;
      case 'offline': return <Badge variant="destructive">Offline</Badge>;
      case 'maintenance': return <Badge variant="secondary">Maintenance</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
        {/* Header */}
        <Section className="py-8 bg-gradient-to-b from-background to-aegis-graphite/20">
          <div className="container-max">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                  <span className="gradient-text">Camera Management</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage and configure your security cameras
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="aegis" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Camera
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Search and Filters */}
        <Section className="py-6">
          <div className="container-max">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cameras by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter: {filterStatus === 'all' ? 'All' : filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All Cameras
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('online')}>
                      Online
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('offline')}>
                      Offline
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('maintenance')}>
                      Maintenance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Section>

        {/* Cameras Grid */}
        <Section className="py-8">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((camera) => (
                <Card key={camera.id} className="card-hover glow-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.status)}`} />
                        <div>
                          <CardTitle className="text-lg">{camera.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {camera.location}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Live
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Camera Preview Placeholder */}
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Camera Preview</p>
                        </div>
                      </div>

                      {/* Camera Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Status</span>
                          {getStatusBadge(camera.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Recording</span>
                          <div className="flex items-center space-x-1">
                            {camera.isRecording ? (
                              <>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-sm text-red-500">REC</span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Paused</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Resolution</span>
                          <span className="text-sm text-muted-foreground">{camera.resolution}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Model</span>
                          <span className="text-sm text-muted-foreground">{camera.model}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Last Seen</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {camera.lastSeen}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCameras.length === 0 && (
              <div className="text-center py-12">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No cameras found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first camera'
                  }
                </p>
                <Button variant="aegis">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Camera
                </Button>
              </div>
            )}
          </div>
        </Section>
    </DashboardLayout>
  );
}