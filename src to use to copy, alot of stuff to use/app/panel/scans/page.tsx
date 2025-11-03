import React, { Suspense } from 'react';
import { cookies } from 'next/headers';

async function fetchScans(token?: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const res = await fetch(`${base}/api/scans`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ScansPage() {
  const jwt = cookies().get('spectra_token')?.value;
  const scans = await fetchScans(jwt);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-heading mb-4">Scans</h1>
      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Risk</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s: any) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.scan_type}</td>
                <td className="p-2">{s.risk_score}</td>
                <td className="p-2">{s.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


