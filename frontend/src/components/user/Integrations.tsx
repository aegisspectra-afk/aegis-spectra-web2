"use client";

import { useState } from "react";
import { Link, Zap, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface IntegrationsProps {
  userEmail?: string;
}

export function Integrations({ userEmail }: IntegrationsProps) {
  const { showToast } = useToastContext();
  const [integrations, setIntegrations] = useState([
    { id: "zapier", name: "Zapier", enabled: false, description: "אוטומציה של משימות עם אלפי אפליקציות" },
    { id: "make", name: "Make (Integromat)", enabled: false, description: "אוטומציה מתקדמת של תהליכים" },
    { id: "webhook", name: "Webhooks", enabled: false, description: "קבלת התראות בזמן אמת" },
  ]);

  const handleToggle = async (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (!integration) return;

    // In production, this would make an API call
    setIntegrations(
      integrations.map((i) =>
        i.id === id ? { ...i, enabled: !i.enabled } : i
      )
    );

    showToast(
      `${integration.name} ${integration.enabled ? "הושבת" : "הופעל"}`,
      "success"
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="size-5 text-gold" />
          אינטגרציות
        </h3>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black/30"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white">{integration.name}</h4>
                {integration.enabled ? (
                  <CheckCircle className="size-4 text-green-400" />
                ) : (
                  <XCircle className="size-4 text-zinc-500" />
                )}
              </div>
              <p className="text-sm text-zinc-400">{integration.description}</p>
              {integration.enabled && (
                <div className="mt-2 text-xs text-zinc-500">
                  {integration.id === "webhook" ? (
                    <div className="space-y-2">
                      <p>Webhook URL: <code className="bg-black/50 px-2 py-1 rounded text-gold">https://api.aegis-spectra.com/webhooks/{userEmail}</code></p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://api.aegis-spectra.com/webhooks/${userEmail}`);
                          showToast("URL הועתק ללוח", "success");
                        }}
                        className="text-gold hover:text-gold/80 text-xs"
                      >
                        העתק URL
                      </button>
                    </div>
                  ) : (
                    <a
                      href={`https://${integration.id}.com/integrations/aegis-spectra`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 flex items-center gap-1"
                    >
                      הגדר אינטגרציה <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => handleToggle(integration.id)}
              className={`relative w-12 h-6 rounded-full transition ml-4 ${
                integration.enabled ? "bg-gold" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  integration.enabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-zinc-800 bg-black/30">
        <p className="text-sm text-zinc-400">
          <strong className="text-white">הערה:</strong> אינטגרציות מאפשרות לך לחבר את החשבון שלך עם שירותים חיצוניים לאוטומציה וניהול משופר.
        </p>
      </div>
    </div>
  );
}

