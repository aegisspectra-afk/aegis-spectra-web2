/**
 * Stats Card Component for Admin Dashboard
 */
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatsCard({ title, value, icon: Icon, change, positive, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 border border-zinc-800 rounded-xl p-6 hover:border-gold/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-full p-3 ${colorClasses[color]}`}>
          <Icon className="size-6" />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-zinc-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </motion.div>
  );
}

