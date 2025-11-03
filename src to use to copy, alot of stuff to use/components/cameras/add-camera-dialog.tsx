'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AddCameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCamera: (cameraData: any) => void;
}

export function AddCameraDialog({ open, onOpenChange, onAddCamera }: AddCameraDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    type: 'IP',
    resolution: '1080p',
    ipAddress: '',
    port: '80',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [cameraLimits, setCameraLimits] = useState({
    current: 0,
    limit: 0,
    canAddMore: true,
    remaining: 0,
    plan: 'BASIC'
  });

  // Check camera limits when dialog opens
  useEffect(() => {
    if (open) {
      checkCameraLimits();
    }
  }, [open]);

  const checkCameraLimits = async () => {
    try {
      // Mock limits for now since we don't have a cameras API
      const limits = {
        current: 0,
        limit: 10,
        canAddMore: true,
        remaining: 10,
        plan: 'BASIC'
      };
      setCameraLimits(limits);
    } catch (error) {
      console.error('Failed to check camera limits:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast.error('Name and location are required');
      return;
    }

    // Check camera limits before adding
    if (!cameraLimits.canAddMore) {
      toast.error(`You have reached the maximum number of cameras for your ${cameraLimits.plan} plan (${cameraLimits.limit} cameras)`);
      return;
    }

    setLoading(true);
    try {
      await onAddCamera(formData);
      setFormData({
        name: '',
        location: '',
        description: '',
        type: 'IP',
        resolution: '1080p',
        ipAddress: '',
        port: '80',
        username: '',
        password: ''
      });
    } catch (error) {
      console.error('Error adding camera:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2 text-aegis-teal" />
            Add New Camera
          </DialogTitle>
          <DialogDescription>
            Configure your security camera settings and connection details.
          </DialogDescription>
          
          {/* Camera Limits Warning */}
          {!cameraLimits.canAddMore && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-red-700">
                <strong>Camera Limit Reached:</strong> You have reached the maximum number of cameras 
                for your {cameraLimits.plan} plan ({cameraLimits.limit} cameras). 
                <a href="/pricing" className="underline ml-1">Upgrade your plan</a> to add more cameras.
              </div>
            </div>
          )}
          
          {/* Camera Limits Info */}
          {cameraLimits.canAddMore && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Camera className="h-4 w-4 text-blue-500" />
              <div className="text-sm text-blue-700">
                <strong>Camera Usage:</strong> {cameraLimits.current} of {cameraLimits.limit === Infinity ? '∞' : cameraLimits.limit} cameras used
                {cameraLimits.remaining !== Infinity && ` (${cameraLimits.remaining} remaining)`}
              </div>
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Camera Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Main Entrance Camera"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Building A - Main Entrance"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description for this camera"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Camera Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IP">IP Camera</SelectItem>
                  <SelectItem value="USB">USB Camera</SelectItem>
                  <SelectItem value="Wireless">Wireless Camera</SelectItem>
                  <SelectItem value="Analog">Analog Camera</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={formData.resolution} onValueChange={(value) => handleInputChange('resolution', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4K">4K Ultra HD</SelectItem>
                  <SelectItem value="8K">8K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === 'IP' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address</Label>
                <Input
                  id="ipAddress"
                  value={formData.ipAddress}
                  onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                  placeholder="192.168.1.100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={formData.port}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                  placeholder="80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="admin"
                />
              </div>
            </div>
          )}

          {formData.type === 'IP' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Camera password"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="aegis"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Camera'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}