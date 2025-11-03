'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Server, 
  Download, 
  Copy, 
  CheckCircle, 
  Clock, 
  Users, 
  Shield,
  Database,
  Network,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DeploymentTemplate {
  id: string;
  name: string;
  type: 'cloud' | 'on-premise' | 'hybrid';
  description: string;
  features: string[];
  requirements: {
    cpu: string;
    memory: string;
    storage: string;
    network: string;
  };
  estimatedTime: string;
  complexity: 'easy' | 'medium' | 'hard';
  status: 'ready' | 'deploying' | 'deployed' | 'failed';
  lastDeployed?: string;
}

const cloudTemplates: DeploymentTemplate[] = [
  {
    id: 'aws-basic',
    name: 'AWS Basic Deployment',
    type: 'cloud',
    description: 'Basic Aegis Spectra deployment on AWS with minimal configuration',
    features: ['Auto-scaling', 'Load balancing', 'RDS database', 'S3 storage'],
    requirements: {
      cpu: '2 vCPUs',
      memory: '4GB RAM',
      storage: '20GB SSD',
      network: '1 Gbps'
    },
    estimatedTime: '15 minutes',
    complexity: 'easy',
    status: 'ready'
  },
  {
    id: 'aws-enterprise',
    name: 'AWS Enterprise Deployment',
    type: 'cloud',
    description: 'Full-featured enterprise deployment with high availability',
    features: ['Multi-AZ', 'Auto-scaling', 'RDS Multi-AZ', 'ElastiCache', 'CloudFront'],
    requirements: {
      cpu: '8 vCPUs',
      memory: '32GB RAM',
      storage: '100GB SSD',
      network: '10 Gbps'
    },
    estimatedTime: '45 minutes',
    complexity: 'hard',
    status: 'ready'
  },
  {
    id: 'azure-basic',
    name: 'Azure Basic Deployment',
    type: 'cloud',
    description: 'Basic deployment on Microsoft Azure platform',
    features: ['Azure SQL', 'Blob storage', 'Application Gateway', 'Monitor'],
    requirements: {
      cpu: '2 vCPUs',
      memory: '4GB RAM',
      storage: '20GB SSD',
      network: '1 Gbps'
    },
    estimatedTime: '20 minutes',
    complexity: 'easy',
    status: 'ready'
  }
];

const onPremiseTemplates: DeploymentTemplate[] = [
  {
    id: 'docker-compose',
    name: 'Docker Compose',
    type: 'on-premise',
    description: 'Single-server deployment using Docker Compose',
    features: ['Easy setup', 'Local database', 'File storage', 'Basic monitoring'],
    requirements: {
      cpu: '4 vCPUs',
      memory: '8GB RAM',
      storage: '50GB SSD',
      network: '1 Gbps'
    },
    estimatedTime: '30 minutes',
    complexity: 'easy',
    status: 'ready'
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Cluster',
    type: 'on-premise',
    description: 'Production-ready Kubernetes deployment',
    features: ['High availability', 'Auto-scaling', 'Service mesh', 'Monitoring'],
    requirements: {
      cpu: '8 vCPUs',
      memory: '32GB RAM',
      storage: '200GB SSD',
      network: '10 Gbps'
    },
    estimatedTime: '2 hours',
    complexity: 'hard',
    status: 'ready'
  },
  {
    id: 'bare-metal',
    name: 'Bare Metal Installation',
    type: 'on-premise',
    description: 'Direct installation on physical hardware',
    features: ['Maximum performance', 'Full control', 'Custom configuration'],
    requirements: {
      cpu: '16 vCPUs',
      memory: '64GB RAM',
      storage: '500GB NVMe',
      network: '10 Gbps'
    },
    estimatedTime: '4 hours',
    complexity: 'hard',
    status: 'ready'
  }
];

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'easy': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'hard': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'text-green-600 bg-green-100';
    case 'deploying': return 'text-blue-600 bg-blue-100';
    case 'deployed': return 'text-purple-600 bg-purple-100';
    case 'failed': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ready': return <Play className="h-4 w-4" />;
    case 'deploying': return <Clock className="h-4 w-4" />;
    case 'deployed': return <CheckCircle className="h-4 w-4" />;
    case 'failed': return <RotateCcw className="h-4 w-4" />;
    default: return <Play className="h-4 w-4" />;
  }
};

export function DeploymentTemplates() {
  const [activeTab, setActiveTab] = useState('cloud');
  const [selectedTemplate, setSelectedTemplate] = useState<DeploymentTemplate | null>(null);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async (template: DeploymentTemplate) => {
    setIsDeploying(true);
    setSelectedTemplate(template);
    setDeploymentLogs([]);
    
    // Simulate deployment process
    const steps = [
      'Initializing deployment...',
      'Validating requirements...',
      'Creating infrastructure...',
      'Installing dependencies...',
      'Configuring services...',
      'Starting applications...',
      'Running health checks...',
      'Deployment completed successfully!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeploymentLogs(prev => [...prev, steps[i]]);
    }
    
    setIsDeploying(false);
  };

  const handleDownloadTemplate = (template: DeploymentTemplate) => {
    // In a real app, this would download the template files
    console.log('Downloading template:', template.name);
  };

  const handleCopyCommand = (template: DeploymentTemplate) => {
    const command = `aegis-deploy --template ${template.id} --type ${template.type}`;
    navigator.clipboard.writeText(command);
  };

  const renderTemplate = (template: DeploymentTemplate) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {template.type === 'cloud' ? <Cloud className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getComplexityColor(template.complexity)}>
                {template.complexity}
              </Badge>
              <Badge className={getStatusColor(template.status)}>
                {getStatusIcon(template.status)}
                <span className="ml-1">{template.status}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Features */}
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-1">
              {template.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h4 className="font-semibold mb-2">System Requirements</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>CPU: {template.requirements.cpu}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>RAM: {template.requirements.memory}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>Storage: {template.requirements.storage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-muted-foreground" />
                <span>Network: {template.requirements.network}</span>
              </div>
            </div>
          </div>

          {/* Deployment Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>⏱️ {template.estimatedTime}</span>
              {template.lastDeployed && (
                <span>Last deployed: {template.lastDeployed}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleDeploy(template)}
              disabled={isDeploying}
            >
              {isDeploying && selectedTemplate?.id === template.id ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Deploy
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadTemplate(template)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopyCommand(template)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Command
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">Deployment Templates</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose from pre-configured deployment templates for cloud, on-premise, or hybrid environments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cloud">Cloud Deployment</TabsTrigger>
          <TabsTrigger value="on-premise">On-Premise</TabsTrigger>
        </TabsList>

        <TabsContent value="cloud" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cloudTemplates.map(renderTemplate)}
          </div>
        </TabsContent>

        <TabsContent value="on-premise" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {onPremiseTemplates.map(renderTemplate)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Deployment Logs */}
      {isDeploying && selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Deploying {selectedTemplate.name}
            </CardTitle>
            <CardDescription>
              Please wait while we set up your deployment...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deploymentLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>
            Get started with Aegis Spectra deployment in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-1">Choose Template</h4>
              <p className="text-sm text-muted-foreground">
                Select a deployment template that matches your needs
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold mb-1">Configure Settings</h4>
              <p className="text-sm text-muted-foreground">
                Customize your deployment with your specific requirements
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold mb-1">Deploy & Monitor</h4>
              <p className="text-sm text-muted-foreground">
                Deploy your instance and monitor the setup process
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}