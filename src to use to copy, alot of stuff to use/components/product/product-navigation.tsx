'use client';

import React from 'react';

type Section = { id: string; label: string };

export function ProductNavigation({ sections }: { sections: Section[] }) {
  return (
    <nav aria-label="ניווט מוצר" className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-max overflow-x-auto">
        <ul className="flex gap-2 py-3 min-w-max">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-border hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                onClick={(e) => {
                  const el = document.getElementById(s.id);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}


