'use client';

import { useState } from 'react';
import { Accessibility, Type, Contrast, Move } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { fontSize, setFontSize, highContrast, setHighContrast, reducedMotion, setReducedMotion } = useAccessibility();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-4 bg-gold text-black rounded-full shadow-lg hover:bg-gold/90 transition-all focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
        aria-label="תפריט נגישות"
        aria-expanded={isOpen}
      >
        <Accessibility className="size-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl min-w-[280px]">
          <h3 className="text-lg font-bold mb-4 text-white">הגדרות נגישות</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 mb-2 text-white">
                <Type className="size-5" />
                <span className="font-semibold">גודל טקסט</span>
              </label>
              <div className="flex gap-2">
                {(['normal', 'large', 'xlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      fontSize === size
                        ? 'bg-gold text-black'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {size === 'normal' ? 'רגיל' : size === 'large' ? 'גדול' : 'גדול מאוד'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-white">
                <Contrast className="size-5" />
                <span className="font-semibold">ניגודיות גבוהה</span>
              </label>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                  highContrast
                    ? 'bg-gold text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {highContrast ? 'מופעל' : 'מושבת'}
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-white">
                <Move className="size-5" />
                <span className="font-semibold">הפחתת תנועה</span>
              </label>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                  reducedMotion
                    ? 'bg-gold text-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {reducedMotion ? 'מופעל' : 'מושבת'}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full px-4 py-2 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition"
          >
            סגור
          </button>
        </div>
      )}
    </>
  );
}

