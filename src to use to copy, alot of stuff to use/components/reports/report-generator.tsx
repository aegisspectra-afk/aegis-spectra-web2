'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  Camera,
  Shield,
  AlertTriangle,
  Activity,
  Loader2,
  CheckCircle,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: any;
  defaultSections: string[];
}

interface ReportSection {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface ReportFilters {
  dateRange: DateRange | undefined;
  cameras: string[];
  eventTypes: string[];
  severity: string[];
  includeCharts: boolean;
  includeImages: boolean;
  includeDetails: boolean;
}

const reportTypes: ReportType[] = [
  {
    id: 'security',
    name: 'Security Report',
    description: 'Comprehensive security analysis with alerts and incidents',
    icon: Shield,
    defaultSections: ['summary', 'alerts', 'incidents', 'cameras', 'trends']
  },
  {
    id: 'monthly',
    name: 'Monthly Report',
    description: 'Monthly system summary and performance metrics',
    icon: Calendar,
    defaultSections: ['summary', 'performance', 'trends', 'recommendations']
  },
  {
    id: 'weekly',
    name: 'Weekly Report',
    description: 'Weekly activity overview and system status',
    icon: Activity,
    defaultSections: ['summary', 'activity', 'alerts', 'status']
  },
  {
    id: 'incident',
    name: 'Incident Report',
    description: 'Detailed analysis of specific security incidents',
    icon: AlertTriangle,
    defaultSections: ['incident_details', 'timeline', 'evidence', 'recommendations']
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Customized report with selected sections and filters',
    icon: Settings,
    defaultSections: ['summary']
  }
];

const reportSections: ReportSection[] = [
  { id: 'summary', name: 'Executive Summary', description: 'High-level overview of key metrics', enabled: true },
  { id: 'alerts', name: 'Security Alerts', description: 'Detailed list of security alerts and notifications', enabled: true },
  { id: 'incidents', name: 'Security Incidents', description: 'Report on security incidents and their resolution', enabled: true },
  { id: 'cameras', name: 'Camera Status', description: 'Status and performance of all cameras', enabled: true },
  { id: 'trends', name: 'Trends Analysis', description: 'Analysis of patterns and trends over time', enabled: true },
  { id: 'performance', name: 'System Performance', description: 'System performance metrics and statistics', enabled: false },
  { id: 'activity', name: 'Activity Log', description: 'Detailed activity log for the period', enabled: false },
  { id: 'status', name: 'System Status', description: 'Overall system health and status', enabled: false },
  { id: 'incident_details', name: 'Incident Details', description: 'Detailed information about specific incidents', enabled: false },
  { id: 'timeline', name: 'Timeline', description: 'Chronological timeline of events', enabled: false },
  { id: 'evidence', name: 'Evidence', description: 'Evidence and supporting materials', enabled: false },
  { id: 'recommendations', name: 'Recommendations', description: 'Recommendations for improvement', enabled: false }
];

export function ReportGenerator() {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState<string>('security');
  const [selectedSections, setSelectedSections] = useState<string[]>(['summary']);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: undefined,
    cameras: [],
    eventTypes: [],
    severity: [],
    includeCharts: true,
    includeImages: false,
    includeDetails: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<string[]>([]);
  const [availableEventTypes, setAvailableEventTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    // Update sections when report type changes
    const reportType = reportTypes.find(rt => rt.id === selectedType);
    if (reportType) {
      setSelectedSections(reportType.defaultSections);
    }
  }, [selectedType]);

  const fetchReportData = async () => {
    try {
      // Fetch available cameras and event types for filters
      const [camerasResponse, eventsResponse] = await Promise.all([
        fetch('/api/catalog'),
        fetch('/api/events/types')
      ]);

      if (camerasResponse.ok) {
        const catalog = await camerasResponse.json();
        const cameras = catalog.products?.filter((product: any) => product.category === 'cameras') || [];
        setAvailableCameras(cameras.map((camera: any) => camera.name));
      }

      if (eventsResponse.ok) {
        const eventTypes = await eventsResponse.json();
        setAvailableEventTypes(eventTypes);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateReport = async (format: 'PDF' | 'HTML' | 'CSV') => {
    if (selectedSections.length === 0) {
      toast.error('Please select at least one report section');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          format,
          sections: selectedSections,
          filters,
          title: `${reportTypes.find(rt => rt.id === selectedType)?.name} - ${new Date().toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      if (format === 'PDF') {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'HTML') {
        const htmlContent = await response.text();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedType}_report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'CSV') {
        const csvContent = await response.text();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedType}_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast.success(`${format} report generated successfully!`);
    } catch (error: any) {
      toast.error('Failed to generate report', {
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReportType = reportTypes.find(rt => rt.id === selectedType);

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Type
          </CardTitle>
          <CardDescription>
            Choose the type of report you want to generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'ring-2 ring-aegis-teal border-aegis-teal'
                    : 'hover:border-aegis-teal/50'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <type.icon className="h-6 w-6 text-aegis-teal" />
                    <div>
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Report Sections
          </CardTitle>
          <CardDescription>
            Select which sections to include in your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-3">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionToggle(section.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={section.id} className="font-medium">
                    {section.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Options
          </CardTitle>
          <CardDescription>
            Customize your report with filters and options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Date Range</Label>
                <DatePickerWithRange
                  value={filters.dateRange ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined}
                  onChange={(date: any) => setFilters(prev => ({ ...prev, dateRange: date }))}
                />
              </div>

              <div>
                <Label>Event Types</Label>
                <Select
                  value={filters.eventTypes[0] || ''}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    eventTypes: value ? [value] : [] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {availableEventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Severity Level</Label>
                <Select
                  value={filters.severity[0] || ''}
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    severity: value ? [value] : [] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={filters.includeCharts}
                    onCheckedChange={(checked) => setFilters(prev => ({ 
                      ...prev, 
                      includeCharts: checked as boolean 
                    }))}
                  />
                  <Label htmlFor="includeCharts">Include Charts & Graphs</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeImages"
                    checked={filters.includeImages}
                    onCheckedChange={(checked) => setFilters(prev => ({ 
                      ...prev, 
                      includeImages: checked as boolean 
                    }))}
                  />
                  <Label htmlFor="includeImages">Include Images & Screenshots</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDetails"
                    checked={filters.includeDetails}
                    onCheckedChange={(checked) => setFilters(prev => ({ 
                      ...prev, 
                      includeDetails: checked as boolean 
                    }))}
                  />
                  <Label htmlFor="includeDetails">Include Detailed Information</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Choose the format and generate your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => handleGenerateReport('PDF')}
                disabled={isGenerating}
                variant="aegis"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleGenerateReport('HTML')}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating HTML...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate HTML
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleGenerateReport('CSV')}
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating CSV...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate CSV
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Selected sections: {selectedSections.length}</p>
              <p>Report type: {selectedReportType?.name}</p>
              {filters.dateRange && (
                <p>Date range: {filters.dateRange.from?.toLocaleDateString()} - {filters.dateRange.to?.toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}