import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, variant = 'dark', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src="/brand/aegis-spectra-logo.png"
          alt="Aegis Spectra Security"
          fill
          sizes="(max-width: 768px) 32px, (max-width: 1024px) 48px, 64px"
          className="object-contain"
          priority
        />
      </div>
      <span className="font-heading font-bold text-xl" style={{color: '#F5F5F5'}}>
        Aegis Spectra
      </span>
    </div>
  );
}