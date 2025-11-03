import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { PDFReportGenerator, generateHTMLReport } from '@/lib/reports/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, format = 'PDF' } = body;

    // Validate report type
    const validTypes = ['Security', 'Monthly', 'Weekly', 'Incident', 'Custom'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Mock data - in a real app, this would come from the database
    const reportData = {
      title: `${type} Report - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      cameras: Math.floor(Math.random() * 20) + 5,
      alerts: Math.floor(Math.random() * 100) + 10,
      incidents: Math.floor(Math.random() * 10),
      type: type as 'Security' | 'Monthly' | 'Weekly' | 'Incident' | 'Custom',
      content: `This is a ${type.toLowerCase()} report generated on ${new Date().toLocaleDateString()}. The report contains detailed information about security events, camera status, and system performance.`
    };

    if (format === 'PDF') {
      const generator = new PDFReportGenerator();
      const pdfBlob = await generator.generateReport(reportData);
      
      return new NextResponse(pdfBlob, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${reportData.title}.pdf"`
        }
      });
    } else if (format === 'HTML') {
      const htmlContent = generateHTMLReport(reportData);
      
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${reportData.title}.html"`
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return available report types
    const reportTypes = [
      { id: 'Security', name: 'Security Report', description: 'Comprehensive security analysis' },
      { id: 'Monthly', name: 'Monthly Report', description: 'Monthly system summary' },
      { id: 'Weekly', name: 'Weekly Report', description: 'Weekly activity overview' },
      { id: 'Incident', name: 'Incident Report', description: 'Detailed incident analysis' },
      { id: 'Custom', name: 'Custom Report', description: 'Customized report generation' }
    ];

    return NextResponse.json({ reportTypes });

  } catch (error) {
    console.error('Error fetching report types:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}