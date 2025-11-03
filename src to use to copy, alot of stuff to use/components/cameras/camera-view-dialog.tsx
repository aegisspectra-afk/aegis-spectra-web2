'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Maximize2
} from 'lucide-react';

interface CameraViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camera: {
    id: string;
    name: string;
    location: string;
    description?: string;
    status: 'online' | 'offline' | 'error';
    lastSeen: string;
    thumbnail?: string;
  };
}

export function CameraViewDialog({ open, onOpenChange, camera }: CameraViewDialogProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Wifi className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Online</Badge>;
      case 'offline':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Offline</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Error</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2 text-aegis-teal" />
            {camera.name}
          </DialogTitle>
          <DialogDescription>
            Live view and camera information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Feed */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
                {camera.thumbnail ? (
                  <img
                    src={camera.thumbnail}
                    alt={camera.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Status Overlay */}
                <div className="absolute top-4 right-4">
                  {getStatusIcon(camera.status)}
                </div>

                {/* Fullscreen Button */}
                <div className="absolute top-4 left-4">
                  <Button size="sm" variant="secondary">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        Record
                      </Button>
                      <Button size="sm" variant="secondary">
                        Snapshot
                      </Button>
                    </div>
                    {getStatusBadge(camera.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-aegis-teal" />
                  Camera Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-sm">{camera.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-sm">{camera.location}</p>
                  </div>
                  {camera.description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p className="text-sm">{camera.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-aegis-teal" />
                  Status Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(camera.status)}
                      <span className="text-sm capitalize">{camera.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Seen</p>
                    <p className="text-sm">{new Date(camera.lastSeen).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                    <p className="text-sm">99.9%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="aegis">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}