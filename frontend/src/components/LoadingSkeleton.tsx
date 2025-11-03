import React from "react";

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-zinc-800 rounded w-1/2"></div>
    </div>
  );
}

export function LeadItemSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-zinc-800 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
        </div>
        <div className="h-8 bg-zinc-800 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-zinc-800 rounded w-1/2 mb-2"></div>
      <div className="h-16 bg-zinc-800 rounded w-full"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black/30 animate-pulse">
      <div className="bg-zinc-900 p-4 flex justify-between">
        <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
        <div className="h-4 bg-zinc-700 rounded w-1/6"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-zinc-800 last:border-b-0 flex justify-between items-center">
          <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/5"></div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-charcoal animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-8 bg-zinc-800 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-zinc-800 rounded w-3/4 mb-8"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 bg-zinc-800 rounded-lg"></div>
          <div className="h-64 bg-zinc-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800/50 bg-black/30 p-6 animate-pulse">
      <div className="h-6 bg-zinc-800 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-zinc-800 rounded w-full mb-4"></div>
      <div className="h-8 bg-zinc-800 rounded w-1/3 mb-6"></div>
      <div className="h-10 bg-zinc-800 rounded w-full"></div>
    </div>
  );
}
