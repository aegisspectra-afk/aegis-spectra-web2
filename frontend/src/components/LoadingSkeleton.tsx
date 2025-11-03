"use client";

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-zinc-800 rounded-lg w-3/4"></div>
      <div className="h-4 bg-zinc-800 rounded-lg w-1/2"></div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="h-10 bg-zinc-800 rounded-lg"></div>
        <div className="h-10 bg-zinc-800 rounded-lg"></div>
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border border-zinc-800 bg-black/30 p-6">
        <div className="h-6 bg-zinc-800 rounded-lg w-1/2 mb-4"></div>
        <div className="h-4 bg-zinc-800 rounded-lg w-3/4 mb-2"></div>
        <div className="h-4 bg-zinc-800 rounded-lg w-1/2 mb-6"></div>
        <div className="h-10 bg-zinc-800 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-black/30 p-6">
      <div className="h-6 bg-zinc-800 rounded-lg w-2/3 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-800 rounded-lg"></div>
        <div className="h-4 bg-zinc-800 rounded-lg w-5/6"></div>
        <div className="h-4 bg-zinc-800 rounded-lg w-4/6"></div>
      </div>
    </div>
  );
}

