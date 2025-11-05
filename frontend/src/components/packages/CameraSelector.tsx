/**
 * Camera Selector Component - סליידר מקצועי לבחירת מספר מצלמות
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

interface CameraSelectorProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function CameraSelector({ min, max, value, onChange, disabled = false }: CameraSelectorProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.round(Number(e.target.value));
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getLabel = (val: number) => {
    if (val === min) return 'כיסוי בסיסי';
    if (val <= min + 1) return 'כיסוי בסיסי';
    if (val === 3 || val === min + 2) return 'כיסוי מלא';
    if (val >= 4) return 'מערכת מתקדמת';
    if (val >= max - 1) return 'מערכת מתקדמת';
    return 'כיסוי אופטימלי';
  };

  const progress = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className="relative w-full py-4">
      {/* Label */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-white font-bold flex items-center gap-2">
          <Camera className="text-gold size-5" />
          מספר מצלמות
        </label>
        <span className="text-zinc-400 text-sm">
          ({min}-{max})
        </span>
      </div>

      {/* Slider container */}
      <div
        className={`relative h-3 rounded-full bg-zinc-800/50 overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onMouseDown={disabled ? undefined : handleMouseDown}
        onMouseUp={disabled ? undefined : handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={disabled ? undefined : handleMouseDown}
        onTouchEnd={disabled ? undefined : handleMouseUp}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />

        {/* Progress bar with gradient */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold via-yellow-500 to-gold rounded-full"
          style={{ width: `${progress}%` }}
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Active indicator / Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 size-5 bg-gold rounded-full shadow-lg border-2 border-zinc-900 ring-2 ring-gold/20"
          style={{
            left: `calc(${progress}% - 10px)`,
          }}
          animate={{
            scale: isDragging ? 1.4 : 1,
            boxShadow: isDragging 
              ? '0 0 20px rgba(234, 179, 8, 0.6)' 
              : '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        />

        {/* Range input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          style={{ WebkitAppearance: 'none', appearance: 'none' }}
        />
      </div>

      {/* Value display with label */}
      <motion.div
        key={currentValue}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        className="text-center mt-5"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-black/80 to-zinc-900/80 border border-gold/50 rounded-full px-6 py-3 text-gold font-bold shadow-lg backdrop-blur-md hover:border-gold transition-colors">
          <motion.span 
            key={currentValue}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="text-2xl"
          >
            {currentValue}
          </motion.span>
          <span className="text-sm text-zinc-300 font-normal">מצלמות</span>
          <span className="text-xs text-zinc-400">•</span>
          <span className="text-sm text-zinc-300 font-normal">{getLabel(currentValue)}</span>
        </div>
      </motion.div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-xs text-zinc-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

