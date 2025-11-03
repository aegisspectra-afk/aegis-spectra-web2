'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PanelLayout } from '@/components/layout/panel-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Plus, 
  Settings, 
  Eye, 
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddCameraDialog } from '@/components/cameras/add-camera-dialog';
import { CameraSettingsDialog } from '@/components/cameras/camera-settings-dialog';
import { CameraViewDialog } from '@/components/cameras/camera-view-dialog';
import { toast } from 'sonner';

interface CameraData {
  id: string;
  name: string;
  location: string;
  description?: string;
  isActive: boolean;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
  thumbnail?: string;
}

export default function CamerasPage() {
  const { data: session } = useSession();
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);

  // Get user role and subscription plan from session
  const userRole = session?.user?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'BASIC';

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/catalog');
      if (response.ok) {
        const catalog = await response.json();
        const cameras = catalog.products?.filter((product: any) => product.category === 'cameras') || [];
        setCameras(cameras);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      toast.error('Failed to fetch cameras');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCamera = async (cameraData: any) => {
    try {
      // For now, just add to local state since we don't have a cameras API
      const newCamera = {
        id: Date.now().toString(),
        ...cameraData,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setCameras(prev => [...prev, newCamera]);
      toast.success('Camera added successfully!');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding camera:', error);
      toast.error('Failed to add camera');
    }
  };

  const handleViewCamera = (camera: CameraData) => {
    setSelectedCamera(camera);
    setShowViewDialog(true);
  };

  const handleSettingsCamera = (camera: CameraData) => {
    setSelectedCamera(camera);
    setShowSettingsDialog(true);
  };

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      const response = await fetch(`/api/cameras/${cameraId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Camera deleted successfully!');
        fetchCameras();
      } else {
        toast.error('Failed to delete camera');
      }
    } catch (error) {
      console.error('Error deleting camera:', error);
      toast.error('Failed to delete camera');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-yellow-500" />;
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
    <PanelLayout userRole={userRole} subscriptionPlan={subscriptionPlan}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Cameras</h1>
            <p className="text-muted-foreground">
              Manage and monitor your security cameras
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="aegis"
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
            <Button
              onClick={() => setShowSettingsDialog(true)}
              variant="outline"
              className="flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-aegis-teal" />
                <div>
                  <p className="text-sm font-medium">Total Cameras</p>
                  <p className="text-2xl font-bold">{cameras.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Online</p>
                  <p className="text-2xl font-bold">
                    {cameras.filter(c => c.status === 'online').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <WifiOff className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Offline</p>
                  <p className="text-2xl font-bold">
                    {cameras.filter(c => c.status === 'offline').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Errors</p>
                  <p className="text-2xl font-bold">
                    {cameras.filter(c => c.status === 'error').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cameras Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : cameras.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No cameras found</h3>
              <p className="text-muted-foreground mb-4">
                Add your first camera to get started with monitoring
              </p>
              <Button onClick={() => setShowAddDialog(true)} variant="aegis">
                <Plus className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </div>
          ) : (
            cameras.map((camera) => (
              <Card key={camera.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Camera Thumbnail */}
                  <div className="relative h-48 bg-muted rounded-t-lg overflow-hidden">
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
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(camera.status)}
                    </div>
                  </div>

                  {/* Camera Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{camera.name}</h3>
                        <p className="text-sm text-muted-foreground">{camera.location}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCamera(camera)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSettingsCamera(camera)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCamera(camera.id)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {camera.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {camera.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {getStatusBadge(camera.status)}
                      <span className="text-xs text-muted-foreground">
                        Last seen: {new Date(camera.lastSeen).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AddCameraDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddCamera={handleAddCamera}
      />
      
      {selectedCamera && (
        <>
          <CameraViewDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            camera={selectedCamera}
          />
          <CameraSettingsDialog
            open={showSettingsDialog}
            onOpenChange={setShowSettingsDialog}
            camera={selectedCamera}
            onUpdate={fetchCameras}
          />
        </>
      )}
    </PanelLayout>
  );
}