'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';

interface PDFDownloaderProps {
  orderId: string;
  orderData: any;
  className?: string;
}

export default function PDFDownloader({ orderId, orderData, className = '' }: PDFDownloaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/pdf/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const { pdf, filename } = await response.json();
      
      // Create download link
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdf}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('שגיאה בהורדת הקובץ. אנא נסה שוב.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className={`flex items-center gap-2 ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          יוצר PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          הורד חשבונית
        </>
      )}
    </Button>
  );
}