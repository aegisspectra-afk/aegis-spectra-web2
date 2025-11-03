'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  type: 'page' | 'service' | 'faq';
}

const searchData: SearchResult[] = [
  {
    title: 'Home',
    description: 'Main page with company overview and services',
    url: '/',
    type: 'page'
  },
  {
    title: 'SaaS Platform',
    description: 'Remote camera management and monitoring platform',
    url: '/saas',
    type: 'service'
  },
  {
    title: 'Pricing Plans',
    description: 'Choose the right plan for your security needs',
    url: '/pricing',
    type: 'page'
  },
  {
    title: 'Contact Us',
    description: 'Get in touch for consultations and support',
    url: '/contact',
    type: 'page'
  },
  {
    title: 'Remote Camera Management',
    description: 'Configure NVR/cloud, smart alerts, and secure off-site access',
    url: '/saas',
    type: 'service'
  },
  {
    title: 'Professional Installations',
    description: 'IP cameras, access control keypads, intercoms, and smart locks',
    url: '/contact',
    type: 'service'
  },
  {
    title: 'Do you provide physical guarding?',
    description: 'No. We are a technology/security systems provider',
    url: '/#faq',
    type: 'faq'
  },
  {
    title: 'Can you view my cameras?',
    description: 'Only with your explicit written authorization',
    url: '/#faq',
    type: 'faq'
  }
];

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const handleResultClick = (url: string) => {
    window.location.href = url;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, pages, or FAQ..."
              className="border-0 shadow-none focus-visible:ring-0 text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.url}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result.url)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          result.type === 'page' ? 'bg-blue-500' :
                          result.type === 'service' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {result.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Type at least 2 characters to search
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}