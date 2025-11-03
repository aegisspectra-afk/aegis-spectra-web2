import React from 'react';
import { cookies } from 'next/headers';

async function fetchReports(token?: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const res = await fetch(`${base}/api/reports`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ReportsPage() {
  const jwt = cookies().get('spectra_token')?.value;
  const reports = await fetchReports(jwt);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-heading mb-4">Reports</h1>
      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Path</th>
              <th className="text-left p-2">Format</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">
                  <a className="text-aegis-blue underline" href={r.path} target="_blank" rel="noopener noreferrer">
                    {r.path}
                  </a>
                </td>
                <td className="p-2">{r.format}</td>
                <td className="p-2">{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          </div>
  );
}