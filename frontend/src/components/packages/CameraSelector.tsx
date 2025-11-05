/**
 * Camera Selector Component - סליידר מקצועי או כפתורי בחירה לבחירת מספר מצלמות
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
  
  // אם יש 3 אפשרויות או פחות, השתמש בכפתורי radio
  const useRadioButtons = max - min + 1 <= 3;

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
    if (val <= min + 1) return 'כיסוי בסיסי';
    if (val === 3 || val === min + 2) return 'כיסוי מלא';
    if (val >= 4) return 'מערכת מתקדמת';
    return 'כיסוי אופטימלי';
  };

  const progress = ((currentValue - min) / (max - min)) * 100;

  // Generate options array
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Radio buttons version (for 3 or fewer options)
  if (useRadioButtons) {
    return (
      <div className="relative w-full py-4">
        {/* Label */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-white font-bold flex items-center gap-2">
            <Camera className="text-gold size-5" />
            בחר כמות מצלמות
          </label>
        </div>

        {/* Radio buttons */}
        <div className="flex gap-3">
          {options.map((option) => (
            <motion.label
              key={option}
              htmlFor={`cam-${option}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex-1 cursor-pointer rounded-xl border-2 p-4 text-center transition-all
                ${
                  currentValue === option
                    ? 'border-gold bg-gold/10 text-gold shadow-lg'
                    : 'border-zinc-700 bg-black/30 text-zinc-300 hover:border-zinc-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="radio"
                id={`cam-${option}`}
                name="camera_count"
                value={option}
                checked={currentValue === option}
                onChange={() => {
                  setCurrentValue(option);
                  onChange(option);
                }}
                disabled={disabled}
                className="sr-only"
              />
              <div className="text-2xl font-bold mb-1">{option}</div>
              <div className="text-sm">מצלמות</div>
            </motion.label>
          ))}
        </div>

        {/* Description */}
        <motion.div
          key={currentValue}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-black/60 border border-gold/40 rounded-full px-4 py-2 text-gold text-sm font-semibold">
            <span>{getLabel(currentValue)}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Slider version (for more than 3 options)
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
            direction: 'ltr', // Force LTR for positioning
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
          style={{ 
            WebkitAppearance: 'none', 
            appearance: 'none',
            direction: 'ltr', // Force LTR for slider to work correctly
          }}
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

