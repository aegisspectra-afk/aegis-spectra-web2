'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiListScans } from '@/lib/api';

export default function NetworkScansPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState('scanme.nmap.org');
  const [scanType, setScanType] = useState<'quick'|'hybrid'|'full'>('quick');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const all = await apiListScans();
      setScans(all.filter((s:any)=>s.scan_type!=='file'));
    } catch (e:any) {
      toast.error('Failed to load scans', { description: e?.message||''});
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const runScan = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const token = (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/) || [])[1];
      const res = await fetch(`${base}/api/scans/network`, {
        method: 'POST',
        headers: {'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${decodeURIComponent(token)}`}:{})},
        body: JSON.stringify({ target, scan_type: scanType })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Scan started');
      await load();
    } catch (e:any) { toast.error('Scan failed', { description: e?.message||''}); }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const token = (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/) || [])[1];
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${base}/api/scans/file-upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('File uploaded and scanned');
      await load();
    } catch (e:any) {
      toast.error('Upload failed', { description: e?.message||''});
    } finally { setUploading(false); inputEl.value=''; }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading mb-4">Network Scans</h1>
      <div className="border rounded p-4 mb-6">
        <div className="text-sm font-medium mb-3">Upload file to scan</div>
        <input type="file" onChange={uploadFile} disabled={uploading} className="mb-6" />
        <div className="text-sm font-medium mb-2">Run network scan</div>
        <div className="text-sm text-muted-foreground mb-2">Target</div>
        <input className="w-full mb-3 rounded border border-border bg-background p-2 text-sm" value={target} onChange={e=>setTarget(e.target.value)} />
        <div className="text-sm text-muted-foreground mb-2">Scan type</div>
        <select className="w-full mb-3 rounded border border-border bg-background p-2 text-sm" value={scanType} onChange={e=>setScanType(e.target.value as any)}>
          <option value="quick">quick</option>
          <option value="hybrid">hybrid</option>
          <option value="full">full</option>
        </select>
        <button className="px-3 py-2 rounded bg-aegis-teal/20" onClick={runScan}>Run network scan</button>
      </div>
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Target</th>
              <th className="p-2 text-left">Open Ports</th>
              <th className="p-2 text-left">Risk</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-2" colSpan={5}>Loading...</td></tr>
            ) : scans.length===0 ? (
              <tr><td className="p-2" colSpan={5}>No scans.</td></tr>
            ) : (
              scans.map((s:any)=> (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.result?.target}</td>
                  <td className="p-2">{(s.result?.open_ports||[]).map((p:any)=>p.port).join(', ')}</td>
                  <td className="p-2">{s.risk_score}</td>
                  <td className="p-2">{s.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


