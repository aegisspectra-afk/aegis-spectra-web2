import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn('section-padding', className)}
    >
      <div className="container-max">
        {children}
      </div>
    </section>
  );
}