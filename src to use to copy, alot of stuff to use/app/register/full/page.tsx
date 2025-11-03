'use client';

import { FullRegisterForm } from '../page';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FullRegisterPage() {
  const router = useRouter();
  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4">
        <div className="mb-3 flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>חזור</Button>
          <Button variant="ghost" onClick={() => router.push('/')}>לדף הבית</Button>
        </div>
      </div>
      <FullRegisterForm />
    </div>
  );
}


