
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/common/section';
import { Monitor, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { apiListScans, apiGetScan, apiDeleteScan, apiCreateScan } from '@/lib/api';

type Scan = { id: number; scan_type: string; risk_score: number; created_at: string };
// simplified: licenses removed from dashboard

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState<any | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const scanList = await apiListScans().catch(() => []);
      setScans(scanList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load + poll fallback
    load();
    const t = setInterval(load, 15000);
    // read JWT from cookie (dev convenience)
    // removed jwt state usage
    // realtime via websocket
    try {
      const baseHttp = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const base = baseHttp.replace('http', 'ws');
      const token = (document.cookie.match(/(?:^|; )spectra_token=([^;]+)/) || [])[1];
      const qs = token ? `?token=${encodeURIComponent(decodeURIComponent(token))}` : '';
      const ws = new WebSocket(`${base}/api/ws/scan-events${qs}`);
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === 'scan_created') {
            setScans((prev) => [{ id: msg.id, scan_type: msg.scan_type, risk_score: msg.risk_score, created_at: new Date().toISOString() }, ...prev].slice(0, 50));
          }
        } catch {}
      };
      ws.onopen = () => { setWsConnected(true); };
      ws.onclose = () => { setWsConnected(false); };
      ws.onerror = () => { setWsConnected(false); };
      return () => { ws.close(); clearInterval(t); };
    } catch {
      return () => clearInterval(t);
    }
  }, []);

  // dashboard-only actions
  const onRefresh = async () => { await load(); };
  const onShowDetails = async (id: number) => {
    try { const s = await apiGetScan(id); setDetails(s); setDetailsOpen(true); } catch (e:any) { toast.error('Failed to load details', { description: e?.message||''}); }
  };
  const onDelete = async (id: number) => {
    if (!confirm('Delete this scan?')) return;
    try { await apiDeleteScan(id); toast.success('Deleted'); await load(); } catch (e:any) { toast.error('Delete failed', { description: e?.message||''}); }
  };

  const createSampleScan = async () => {
    try {
      await apiCreateScan({ scan_type: 'quick', result: { ok: true }, risk_score: Math.round(Math.random()*100)/10 });
      toast.success('Sample scan created');
      await load();
    } catch (e: any) {
      toast.error('Failed creating scan', { description: e?.message || '' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">SaaS Dashboard</h1>
            <p className="text-sm text-muted-foreground">Quick access to device status, alerts, and recent scans.</p>
          </div>
          <div className="text-xs rounded px-2 py-1 border border-border">
            WS: {wsConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Device Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Monitor className="h-6 w-6" />
                      </div>
                      <CardTitle>Device Status</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      WS: {wsConnected ? 'Connected' : 'Disconnected'}
                    </CardDescription>
                    <a className="px-3 py-2 rounded bg-muted inline-block mt-4" href="/saas/device-status">View Status</a>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Alerts Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-muted">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <CardTitle>Alerts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>View and filter alerts.</CardDescription>
                    <a className="px-3 py-2 rounded bg-muted inline-block mt-4" href="/saas/alerts">View Alerts</a>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Network Scan Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="border border-border">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Shield className="h-6 w-6" />
                      </div>
                      <CardTitle>Network Scan</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Run and view network scans.</CardDescription>
                    <a className="px-3 py-2 rounded bg-muted inline-block mt-4" href="/saas/network-scans">Open Network Scans</a>
                  </CardContent>
                </Card>
              </motion.div>
        </div>

        {/* Recent Scans Table */}
        <div className="mt-10">
          <Card className="border border-border">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Recent Scans</CardTitle>
                    </div>
                    <div className="shrink-0">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onRefresh}>Refresh</Button>
                        <Button variant="outline" size="sm" onClick={createSampleScan}>Create Sample</Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">טוען...</p>
                  ) : scans.length === 0 ? (
                    <p className="text-sm text-muted-foreground">אין נתונים עדיין. צור סריקה לדוגמה.</p>
                  ) : (
                    <div className="overflow-x-auto mx-auto">
                      <table dir="ltr" className="w-full text-sm table-fixed">
                        <colgroup>
                          <col style={{ width: '8%' }} />
                          <col style={{ width: '28%' }} />
                          <col style={{ width: '12%' }} />
                          <col style={{ width: '32%' }} />
                          <col style={{ width: '20%' }} />
                        </colgroup>
                        <thead className="text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-center align-middle">#</th>
                            <th className="px-3 py-2 text-center align-middle">Type</th>
                            <th className="px-3 py-2 text-center align-middle">Risk</th>
                            <th className="px-3 py-2 text-center align-middle">Time</th>
                            <th className="px-3 py-2 text-center align-middle">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scans
                            .slice()
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, 10)
                            .map(s => (
                            <tr key={s.id} className="border-t border-border">
                              <td className="px-3 py-2 text-center align-middle">{s.id}</td>
                              <td className="px-3 py-2 text-center align-middle truncate" title={s.scan_type}>{s.scan_type}</td>
                              <td className="px-3 py-2 text-center align-middle">{s.risk_score}</td>
                              <td className="px-3 py-2 text-center align-middle whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                              <td className="px-3 py-2 text-center align-middle">
                                <div className="inline-flex gap-2 flex-wrap justify-center">
                                  <Button variant="outline" size="sm" onClick={()=>onShowDetails(s.id)}>Details</Button>
                                  <Button variant="outline" size="sm" onClick={()=>onDelete(s.id)}>Delete</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                {detailsOpen && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={()=>setDetailsOpen(false)}>
                    <div className="bg-background border border-border rounded p-4 max-w-2xl w-full mx-4" onClick={(e)=>e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">Scan #{details?.id}</div>
                        <Button variant="ghost" size="sm" onClick={()=>setDetailsOpen(false)}>Close</Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-[60vh]">{JSON.stringify(details, null, 2)}</pre>
                    </div>
                  </div>
                )}
          </Card>
        </div>
      </div>
    </div>
  );
}