'use client';

import React from 'react';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  isOnline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOnline }) => {
  return (
    <header className="py-4 px-6 border-b bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            Salud Móvil
          </h1>
        </div>
        <Badge variant={isOnline ? 'default' : 'destructive'} className={isOnline ? 'bg-accent text-accent-foreground' : ''}>
          {isOnline ? 'En línea' : 'Sin conexión'}
        </Badge>
      </div>
    </header>
  );
};

export default Header;
