'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProductsChartProps {
  data: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export function ProductsChart({ data }: ProductsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400 text-center">אין נתונים להצגה</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-white">מוצרים מובילים</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.slice(0, 5)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
          />
          <Legend />
          <Bar 
            dataKey="sales" 
            fill="#10B981" 
            name="מכירות"
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="revenue" 
            fill="#D4AF37" 
            name="הכנסות (₪)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

