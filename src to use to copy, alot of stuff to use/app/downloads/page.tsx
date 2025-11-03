'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/components/common/section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiAgentLatest } from '@/lib/api';
import { TopBar } from '@/components/layout/topbar';
import { useSession } from 'next-auth/react';
import { Download as DownloadIcon, Terminal, Monitor, Copy, Info, CheckCircle2 } from 'lucide-react';

export default function DownloadsPage() {
  const [latest, setLatest] = useState<{version: string; url: string} | null>(null);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roles?.[0] || 'CLIENT';
  const subscriptionPlan = (session?.user as any)?.subscriptionPlan || 'FREE';
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    apiAgentLatest().then(setLatest).catch(()=>setLatest(null));
  }, []);
  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => {}} userRole={userRole} subscriptionPlan={subscriptionPlan} showNav />
      <div className="pt-20">
        {/* Hero */}
        <Section className="py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">Downloads</h1>
                <p className="text-sm text-muted-foreground">Get the Desktop Agent and CLI tools. Latest versions and quick install commands.</p>
              </div>
              {latest && (
                <div className="text-xs border border-border rounded px-2 py-1">Latest Agent: {latest.version}</div>
              )}
            </div>
          </div>
        </Section>

        {/* Content */}
        <Section className="py-6">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Agent */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  <CardTitle>Desktop Agent (Windows)</CardTitle>
                </div>
                <CardDescription>Continuous monitoring and scan execution from your workstation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a className="inline-flex items-center gap-2 underline" href={latest?.url || "/desktop-app/Aegis-Spectra-Desktop-Setup.exe"}>
                    <DownloadIcon className="h-4 w-4" /> Windows Installer (.exe)
                  </a>
                  <a className="inline-flex items-center gap-2 underline" href="/desktop-app/Aegis-Spectra-Desktop.exe">
                    <DownloadIcon className="h-4 w-4" /> Windows Portable (.exe)
                  </a>
                  {latest && (
                    <div className="pt-2">
                      <Button asChild variant="outline">
                        <a href={latest.url}><DownloadIcon className="h-4 w-4 mr-2" /> Download v{latest.version}</a>
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" /> Requires Windows 10/11, admin privileges for full features.
                  </div>
                  <ul className="mt-3 text-sm space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Auto-updates (when enabled)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Background service</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Works with your SaaS account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* CLI */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  <CardTitle>Aegis CLI</CardTitle>
                </div>
                <CardDescription>Command-line scanning and automation.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Python (pip)</div>
                    <div className="relative">
                      <pre className="text-xs bg-muted rounded p-3 overflow-auto"><code>pip install aegis-spectra-cli</code></pre>
                      <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={() => copyText('pip install aegis-spectra-cli','pip')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Windows (PowerShell)</div>
                    <div className="relative">
                      <pre className="text-xs bg-muted rounded p-3 overflow-auto"><code>py -3.11 -m pip install --upgrade pip &amp;&amp; py -3.11 -m venv .venv &amp;&amp; . .venv/Scripts/Activate.ps1 &amp;&amp; pip install aegis-spectra-cli</code></pre>
                      <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={() => copyText('py -3.11 -m pip install --upgrade pip && py -3.11 -m venv .venv && . .venv/Scripts/Activate.ps1 && pip install aegis-spectra-cli','ps')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* End-user tips only */}
                  <div className="text-xs text-muted-foreground">
                    Tip: After install, open the app/CLI and log in with your account.
                  </div>
                  <div className="pt-2">
                    <Button asChild variant="outline">
                      <a href="/saas/network-scans">Open Network Scans</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Release notes placeholder */}
        <Section className="py-4">
          <div className="max-w-5xl mx-auto px-4">
            <Card>
              <CardHeader>
                <CardTitle>Release notes</CardTitle>
                <CardDescription>Latest changes and fixes (coming soon).</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Security patches and stability improvements.</li>
                  <li>Improved scan performance in hybrid mode.</li>
                  <li>Better error messages on network failures.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Section>
      </div>
    </div>
  );
}


