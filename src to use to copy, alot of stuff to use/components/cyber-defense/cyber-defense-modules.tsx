'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  Database, 
  Network, 
  FileText,
  Zap,
  Eye,
  Lock,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface ThreatDetection {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'malware' | 'network' | 'behavior' | 'file';
  description: string;
  timestamp: string;
  status: 'active' | 'quarantined' | 'resolved';
  source: string;
}

interface ScanResult {
  id: string;
  type: 'quick' | 'full' | 'custom';
  status: 'running' | 'completed' | 'failed';
  progress: number;
  threatsFound: number;
  startTime: string;
  endTime?: string;
}

const mockThreats: ThreatDetection[] = [
  {
    id: '1',
    name: 'Suspicious Network Activity',
    severity: 'high',
    type: 'network',
    description: 'Unusual data transfer patterns detected from external IP',
    timestamp: '2 minutes ago',
    status: 'active',
    source: '192.168.1.100'
  },
  {
    id: '2',
    name: 'Malware Signature Match',
    severity: 'critical',
    type: 'malware',
    description: 'Trojan horse detected in downloaded file',
    timestamp: '15 minutes ago',
    status: 'quarantined',
    source: 'C:\\Downloads\\suspicious.exe'
  },
  {
    id: '3',
    name: 'Privilege Escalation Attempt',
    severity: 'high',
    type: 'behavior',
    description: 'Unauthorized attempt to gain administrative privileges',
    timestamp: '1 hour ago',
    status: 'resolved',
    source: 'User: john.doe'
  }
];

const mockScanResults: ScanResult[] = [
  {
    id: '1',
    type: 'quick',
    status: 'completed',
    progress: 100,
    threatsFound: 2,
    startTime: '2025-01-15 10:30:00',
    endTime: '2025-01-15 10:32:00'
  },
  {
    id: '2',
    type: 'full',
    status: 'running',
    progress: 65,
    threatsFound: 0,
    startTime: '2025-01-15 11:00:00'
  }
];

export function CyberDefenseModules() {
  const [activeTab, setActiveTab] = useState('overview');
  const [threats] = useState<ThreatDetection[]>(mockThreats);
  const [scans] = useState<ScanResult[]>(mockScanResults);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600';
      case 'quarantined': return 'text-orange-600';
      case 'resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <XCircle className="h-4 w-4" />;
      case 'quarantined': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="scans">Security Scans</TabsTrigger>
          <TabsTrigger value="modules">Defense Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                    <p className="text-2xl font-bold text-red-600">3</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scans Today</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                  </div>
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Files Quarantined</p>
                    <p className="text-2xl font-bold text-orange-600">7</p>
                  </div>
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Health</p>
                    <p className="text-2xl font-bold text-green-600">98%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Traffic</span>
                    <Badge variant="outline" className="text-green-600">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <Badge variant="outline" className="text-yellow-600">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <Badge variant="outline" className="text-green-600">67%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disk Space</span>
                    <Badge variant="outline" className="text-green-600">23%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Threat Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">YARA Rules</span>
                    <Badge variant="outline" className="text-green-600">Updated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">VirusTotal API</span>
                    <Badge variant="outline" className="text-green-600">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Threat Feeds</span>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Update</span>
                    <Badge variant="outline" className="text-blue-600">2 min ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Threat Detection</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Run Scan
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {threats.map((threat) => (
              <Card key={threat.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{threat.name}</h4>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <div className={`flex items-center gap-1 ${getStatusColor(threat.status)}`}>
                          {getStatusIcon(threat.status)}
                          <span className="text-sm">{threat.status}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Type: {threat.type}</span>
                        <span>Source: {threat.source}</span>
                        <span>Time: {threat.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Quarantine
                      </Button>
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Security Scans</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Quick Scan
              </Button>
              <Button size="sm">
                <Database className="h-4 w-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {scans.map((scan) => (
              <Card key={scan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold capitalize">{scan.type} Scan</h4>
                        <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                          {scan.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Started: {scan.startTime}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{scan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scan.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Threats Found: {scan.threatsFound}</span>
                          {scan.endTime && <span>Completed: {scan.endTime}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {scan.status === 'running' && (
                        <Button size="sm" variant="outline">
                          Stop
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <h3 className="text-lg font-semibold">Defense Modules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  YARA Rules Engine
                </CardTitle>
                <CardDescription>
                  Advanced pattern matching for malware detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="text-green-600 bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rules Loaded</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Update</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Configure Rules
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2" />
                  Network IDS
                </CardTitle>
                <CardDescription>
                  Real-time network intrusion detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="text-green-600 bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Packets Analyzed</span>
                    <span className="font-semibold">2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Threats Blocked</span>
                    <span className="font-semibold text-red-600">23</span>
                  </div>
                  <Button size="sm" className="w-full">
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  VirusTotal Integration
                </CardTitle>
                <CardDescription>
                  Cloud-based threat intelligence and file analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="text-green-600 bg-green-100">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Calls Today</span>
                    <span className="font-semibold">1,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Files Analyzed</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Configure API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}