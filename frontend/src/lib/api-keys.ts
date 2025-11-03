// API Key management utilities

export interface ApiKeyInfo {
  id: number;
  userId: number;
  apiKey: string; // Only returned once when created
  apiKeyHash: string; // Stored in DB
  name?: string; // Optional name for the key
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// Format API key for display (show only last 8 chars)
export function formatApiKeyForDisplay(apiKey: string): string {
  if (apiKey.length <= 12) return '••••••••';
  return `aegis_••••${apiKey.slice(-8)}`;
}

// Validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  return apiKey.startsWith('aegis_') && apiKey.length === 70; // 6 + 1 + 64 hex chars
}

