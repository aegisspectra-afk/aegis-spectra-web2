import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderData } = await request.json();

    if (!orderId || !orderData) {
      return NextResponse.json(
        { error: 'Order ID and order data are required' },
        { status: 400 }
      );
    }

    // Create PDF
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Company header
    doc.setFontSize(24);
    doc.setTextColor(26, 115, 232); // Aegis blue
    doc.text('Aegis Spectra Security', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('מערכות מיגון ואבטחה מקצועיות', 20, 40);
    doc.text('טלפון: 03-1234567 | מייל: info@aegis-spectra.co.il', 20, 50);
    doc.text('כתובת: רחוב האבטחה 123, תל אביב', 20, 60);
    
    // Invoice details
    doc.setFontSize(18);
    doc.text('חשבונית / הצעת מחיר', 20, 80);
    
    doc.setFontSize(12);
    doc.text(`מספר הזמנה: ${orderId}`, 20, 95);
    doc.text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, 20, 105);
    
    // Customer information
    doc.setFontSize(14);
    doc.text('פרטי לקוח:', 20, 125);
    
    doc.setFontSize(12);
    const customer = orderData.customerInfo;
    doc.text(`שם: ${customer.firstName} ${customer.lastName}`, 20, 140);
    doc.text(`מייל: ${customer.email}`, 20, 150);
    doc.text(`טלפון: ${customer.phone}`, 20, 160);
    doc.text(`כתובת: ${customer.address}, ${customer.city} ${customer.zipCode}`, 20, 170);
    
    // Items table
    doc.setFontSize(14);
    doc.text('פירוט הזמנה:', 20, 190);
    
    // Table headers
    doc.setFontSize(10);
    doc.text('מוצר', 20, 205);
    doc.text('מק״ט', 80, 205);
    doc.text('כמות', 120, 205);
    doc.text('מחיר יחידה', 150, 205);
    doc.text('סה״כ', 180, 205);
    
    // Table line
    doc.line(20, 210, 200, 210);
    
    let yPosition = 220;
    let totalAmount = 0;
    
    // Items
    orderData.items.forEach((item: any) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;
      
      doc.text(item.name, 20, yPosition);
      doc.text(item.sku, 80, yPosition);
      doc.text(item.quantity.toString(), 120, yPosition);
      doc.text(`₪${item.price.toLocaleString()}`, 150, yPosition);
      doc.text(`₪${itemTotal.toLocaleString()}`, 180, yPosition);
      
      yPosition += 10;
    });
    
    // Totals
    yPosition += 10;
    doc.line(20, yPosition, 200, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text('סכום ביניים:', 150, yPosition);
    doc.text(`₪${totalAmount.toLocaleString()}`, 180, yPosition);
    yPosition += 10;
    
    const shippingCost = orderData.shippingMethod === 'express' ? 50 : 
                        orderData.shippingMethod === 'pickup' ? 0 : 25;
    if (shippingCost > 0) {
      doc.text('משלוח:', 150, yPosition);
      doc.text(`₪${shippingCost.toLocaleString()}`, 180, yPosition);
      yPosition += 10;
    }
    
    doc.setFontSize(14);
    doc.text('סה״כ לתשלום:', 150, yPosition);
    doc.text(`₪${(totalAmount + shippingCost).toLocaleString()}`, 180, yPosition);
    
    // Payment method
    yPosition += 20;
    doc.setFontSize(12);
    doc.text(`אמצעי תשלום: ${getPaymentMethodText(orderData.paymentMethod)}`, 20, yPosition);
    
    // Notes
    if (orderData.notes) {
      yPosition += 15;
      doc.text('הערות:', 20, yPosition);
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(orderData.notes, 20, yPosition);
    }
    
    // Footer
    yPosition += 30;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('תודה על הרכישה שלך!', 20, yPosition);
    doc.text('לשאלות ותמיכה: 03-1234567', 20, yPosition + 10);
    
    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Convert to base64
    const base64 = Buffer.from(pdfBuffer).toString('base64');
    
    return NextResponse.json({
      success: true,
      pdf: base64,
      filename: `invoice-${orderId}.pdf`
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function getPaymentMethodText(method: string): string {
  switch (method) {
    case 'paypal':
      return 'PayPal';
    case 'credit-card':
      return 'כרטיס אשראי';
    case 'bit':
      return 'Bit';
    case 'paybox':
      return 'PayBox';
    default:
      return 'לא צוין';
  }
}