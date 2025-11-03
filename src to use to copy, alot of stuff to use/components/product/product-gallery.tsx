'use client';

import React from 'react';
import Image, { StaticImageData } from 'next/image';

export function ProductGallery({ images }: { images: Array<{ src: StaticImageData; alt: string }>; }) {
  const [idx, setIdx] = React.useState(0);
  return (
    <div>
      <div className="aspect-square rounded-2xl bg-muted/30 p-4 flex items-center justify-center">
        <Image
          src={images[idx].src}
          alt={images[idx].alt}
          className="w-full h-full object-contain rounded-lg"
          sizes="(min-width:1024px) 50vw, 100vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((im, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`aspect-square rounded-lg border ${i === idx ? 'border-aegis-blue' : 'border-border'} bg-muted/30 hover:border-aegis-blue`}
              aria-label={`תמונה ${i + 1}`}
            >
              <Image src={im.src} alt={im.alt} className="w-full h-full object-contain rounded-md" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


