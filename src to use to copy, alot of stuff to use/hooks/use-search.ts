'use client';

import { useState, useCallback } from 'react';
import { SearchFilters } from '@/components/dashboard/advanced-search';
import { SearchResult } from '@/components/dashboard/search-results';

interface UseSearchOptions {
  onSearch?: (filters: SearchFilters) => Promise<SearchResult[]>;
  onError?: (error: Error) => void;
}

export function useSearch(options: UseSearchOptions = {}) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      if (options.onSearch) {
        const searchResults = await options.onSearch(filters);
        setResults(searchResults);
        setTotalCount(searchResults.length);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Search failed');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clear = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setCurrentFilters(null);
    setError(null);
  }, []);

  const updateResult = useCallback((resultId: string, updates: Partial<SearchResult>) => {
    setResults(prev => 
      prev.map(result => 
        result.id === resultId 
          ? { ...result, ...updates }
          : result
      )
    );
  }, []);

  const removeResult = useCallback((resultId: string) => {
    setResults(prev => prev.filter(result => result.id !== resultId));
    setTotalCount(prev => prev - 1);
  }, []);

  return {
    results,
    isLoading,
    error,
    totalCount,
    currentFilters,
    search,
    clear,
    updateResult,
    removeResult,
  };
}