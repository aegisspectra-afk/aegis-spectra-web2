'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Camera, 
  User, 
  FileText, 
  AlertTriangle, 
  Settings, 
  BarChart3,
  Shield,
  Clock,
  ExternalLink,
  Command,
  Zap,
  Activity,
  Database
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getUserPermissions } from '@/lib/user-permissions';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'camera' | 'user' | 'report' | 'alert' | 'setting' | 'analytics' | 'security' | 'device' | 'event' | 'playbook' | 'policy';
  url: string;
  timestamp?: string;
  status?: 'active' | 'inactive' | 'warning' | 'error';
  category: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  planRequired?: 'BASIC' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
}

const mockSearchResults: SearchResult[] = [
  // Basic Plan Results
  {
    id: '1',
    title: 'Camera 01 - Main Entrance',
    description: 'IP Camera monitoring main entrance area',
    type: 'camera',
    url: '/panel/cameras/1',
    status: 'active',
    category: 'Security Cameras',
    priority: 'medium',
    planRequired: 'BASIC'
  },
  {
    id: '2',
    title: 'Security Alert - Motion Detected',
    description: 'Motion detected at main entrance at 2:30 PM',
    type: 'alert',
    url: '/panel/alerts/2',
    status: 'warning',
    category: 'Alerts',
    priority: 'high',
    planRequired: 'BASIC'
  },
  {
    id: '3',
    title: 'Daily Security Report',
    description: 'Daily security summary report for today',
    type: 'report',
    url: '/panel/reports/daily',
    status: 'active',
    category: 'Reports',
    priority: 'low',
    planRequired: 'BASIC'
  },
  
  // Pro Plan Results
  {
    id: '4',
    title: 'Device Analytics Dashboard',
    description: 'Real-time analytics for all connected devices',
    type: 'analytics',
    url: '/panel/analytics',
    status: 'active',
    category: 'Analytics',
    priority: 'medium',
    planRequired: 'PRO'
  },
  {
    id: '5',
    planRequired: 'PRO'
  },
  
  // Business Plan Results
  {
    id: '6',
    title: 'Malware Detection Playbook',
    description: 'Automated response playbook for malware detection',
    type: 'playbook',
    url: '/panel/playbooks/malware',
    status: 'active',
    category: 'Playbooks',
    priority: 'critical',
    planRequired: 'BUSINESS'
  },
  {
    id: '7',
    title: 'Security Policy - Access Control',
    description: 'Access control policy configuration',
    type: 'policy',
    url: '/panel/policies/access',
    status: 'active',
    category: 'Policies',
    priority: 'high',
    planRequired: 'BUSINESS'
  },
  {
    id: '8',
    title: 'Scheduled Security Scan',
    description: 'Automated security scan scheduled for tonight',
    type: 'event',
    url: '/panel/scheduler/scans',
    status: 'active',
    category: 'Scheduler',
    priority: 'medium',
    planRequired: 'BUSINESS'
  },
  
  // Enterprise Plan Results
  {
    id: '9',
    title: 'SIEM Integration - Splunk',
    description: 'Splunk SIEM integration status and logs',
    type: 'security',
    url: '/panel/siem/splunk',
    status: 'active',
    category: 'SIEM Integration',
    priority: 'high',
    planRequired: 'ENTERPRISE'
  },
  {
    id: '10',
    title: 'Compliance Report - SOC2',
    description: 'SOC2 compliance status and audit report',
    type: 'report',
    url: '/panel/compliance/soc2',
    status: 'active',
    category: 'Compliance',
    priority: 'critical',
    planRequired: 'ENTERPRISE'
  },
  {
    id: '11',
    title: 'Monthly Security Report',
    description: 'Comprehensive security analysis for January 2025',
    type: 'report',
    url: '/panel/reports/monthly',
    timestamp: '2 hours ago',
    category: 'Reports',
    priority: 'medium',
    planRequired: 'BASIC'
  },
  {
    id: '12',
    title: 'User Management Settings',
    description: 'Configure user roles and permissions',
    type: 'setting',
    url: '/panel/settings/users',
    category: 'Settings',
    priority: 'low',
    planRequired: 'PRO'
  },
  {
    id: '13',
    title: 'System Analytics Dashboard',
    description: 'Real-time system performance metrics',
    type: 'analytics',
    url: '/panel/analytics',
    category: 'Analytics',
    priority: 'medium',
    planRequired: 'PRO'
  },
  {
    id: '14',
    title: 'Camera 02 - Parking Lot',
    description: 'IP Camera monitoring parking area',
    type: 'camera',
    url: '/panel/cameras/2',
    status: 'inactive',
    category: 'Security Cameras',
    priority: 'low',
    planRequired: 'BASIC'
  },
  {
    id: '15',
    title: 'Threat Detection Module',
    description: 'Advanced threat detection and response',
    type: 'security',
    url: '/panel/cyber-defense',
    category: 'Cyber Defense',
    priority: 'high',
    planRequired: 'BUSINESS'
  },
  {
    id: '16',
    title: 'John Doe - Administrator',
    description: 'System administrator user account',
    type: 'user',
    url: '/panel/users/john-doe',
    status: 'active',
    category: 'User Management',
    priority: 'medium',
    planRequired: 'PRO'
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'camera': return <Camera className="h-4 w-4" />;
    case 'user': return <User className="h-4 w-4" />;
    case 'report': return <FileText className="h-4 w-4" />;
    case 'alert': return <AlertTriangle className="h-4 w-4" />;
    case 'setting': return <Settings className="h-4 w-4" />;
    case 'analytics': return <BarChart3 className="h-4 w-4" />;
    case 'security': return <Shield className="h-4 w-4" />;
    case 'device': return <Activity className="h-4 w-4" />;
    case 'event': return <Clock className="h-4 w-4" />;
    case 'playbook': return <Zap className="h-4 w-4" />;
    case 'policy': return <Database className="h-4 w-4" />;
    default: return <Search className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'camera': return 'text-blue-600 bg-blue-100';
    case 'user': return 'text-green-600 bg-green-100';
    case 'report': return 'text-purple-600 bg-purple-100';
    case 'alert': return 'text-red-600 bg-red-100';
    case 'setting': return 'text-gray-600 bg-gray-100';
    case 'analytics': return 'text-orange-600 bg-orange-100';
    case 'security': return 'text-indigo-600 bg-indigo-100';
    case 'device': return 'text-cyan-600 bg-cyan-100';
    case 'event': return 'text-amber-600 bg-amber-100';
    case 'playbook': return 'text-emerald-600 bg-emerald-100';
    case 'policy': return 'text-violet-600 bg-violet-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'active': return 'text-green-600';
    case 'inactive': return 'text-gray-600';
    case 'warning': return 'text-yellow-600';
    case 'error': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Get user permissions based on session
  const getUserPlan = useCallback(() => {
    if (!session?.user) return 'BASIC';
    return (session.user as any).subscriptionPlan || 'BASIC';
  }, [session]);

  const getUserRole = useCallback(() => {
    if (!session?.user) return 'CLIENT';
    return (session.user as any).role || 'CLIENT';
  }, [session]);

  // Filter results based on user plan and permissions
  const filterResultsByPlan = useCallback((searchResults: SearchResult[]) => {
    const userPlan = getUserPlan();
    const userRole = getUserRole();
    
    // Super admins and admins can see everything
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      return searchResults;
    }

    // Filter by plan requirements
    return searchResults.filter(result => {
      if (!result.planRequired) return true;
      
      const planHierarchy = ['BASIC', 'PRO', 'BUSINESS', 'ENTERPRISE'];
      const userPlanIndex = planHierarchy.indexOf(userPlan);
      const requiredPlanIndex = planHierarchy.indexOf(result.planRequired);
      
      return userPlanIndex >= requiredPlanIndex;
    });
  }, [getUserPlan, getUserRole]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setFilteredResults([]);
      return;
    }

    const filtered = mockSearchResults.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    const planFiltered = filterResultsByPlan(filtered);
    setResults(planFiltered);
    setFilteredResults(planFiltered);
    setSelectedIndex(0);
  }, [query, filterResultsByPlan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, results, selectedIndex, onOpenChange]);

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.url);
    onOpenChange(false);
    setQuery('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 bg-gray-900 text-gray-100 border border-gray-700">
        <div className="border-0 shadow-lg">
          <div className="p-4 border-b border-gray-700">
            <Input
              ref={inputRef}
              placeholder="Search cameras, users, reports, alerts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-lg bg-gray-800 text-white border-gray-600 focus:border-gray-500"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 && query.length >= 2 && (
              <div className="p-8 text-center text-gray-400">No results found.</div>
            )}
            
            {results.length > 0 && (
              <div>
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/10 ${
                      index === selectedIndex ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{result.title}</h4>
                        {result.status && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(result.status)}`}
                          >
                            {result.status}
                          </Badge>
                        )}
                        {result.priority && (
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(result.priority)}`} />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {result.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">
                          {result.category}
                        </Badge>
                        {result.planRequired && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {result.planRequired}
                          </Badge>
                        )}
                        {result.timestamp && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {result.timestamp}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
            
            {query.length < 2 && (
              <div className="p-6 text-center text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Type to search for cameras, users, reports, and more...</p>
                <div className="mt-4 text-xs">
                  <p>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded text-gray-200">⌘K</kbd> to open search</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for global search
export function useGlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}