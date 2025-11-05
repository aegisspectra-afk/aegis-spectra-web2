/**
 * Quote Draft Management - Save/load drafts from localStorage and API
 */
import { Package } from '@/types/packages';
import { PackagePriceOptions } from '@/lib/packages/calculatePrice';

export interface QuoteDraft {
  id: string;
  packageSlug: string;
  packageSnapshot?: Package;
  options: PackagePriceOptions;
  propertyDetails?: {
    size?: string;
    location?: string;
    specialRequirements?: string;
    budget?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const DRAFT_STORAGE_KEY = 'aegis_quote_draft';
const DRAFT_EXPIRY_DAYS = 7;

/**
 * Save draft to localStorage
 */
export function saveDraftToLocalStorage(draft: Omit<QuoteDraft, 'id' | 'createdAt' | 'updatedAt'>): void {
  if (typeof window === 'undefined') return;

  try {
    const existingDraft = loadDraftFromLocalStorage();
    const draftData: QuoteDraft = {
      id: existingDraft?.id || `draft_${Date.now()}`,
      ...draft,
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error);
  }
}

/**
 * Load draft from localStorage
 */
export function loadDraftFromLocalStorage(): QuoteDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftJson) return null;

    const draft: QuoteDraft = JSON.parse(draftJson);

    // Check expiry
    const updatedAt = new Date(draft.updatedAt);
    const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate > DRAFT_EXPIRY_DAYS) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return null;
    }

    return draft;
  } catch (error) {
    console.error('Failed to load draft from localStorage:', error);
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraftFromLocalStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

/**
 * Save draft to API (server-side)
 */
export async function saveDraftToAPI(draft: Omit<QuoteDraft, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    const response = await fetch('/api/quotes/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.draftId;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to save draft to API:', error);
    return null;
  }
}

/**
 * Load draft from API
 */
export async function loadDraftFromAPI(draftId: string): Promise<QuoteDraft | null> {
  try {
    const response = await fetch(`/api/quotes/draft/${draftId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.draft;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load draft from API:', error);
    return null;
  }
}

