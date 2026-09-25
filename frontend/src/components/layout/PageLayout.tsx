import type { ReactNode } from 'react';
import { Header } from './Header';

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-midnight text-text-bright">
      <Header />
      <main className="max-w-[720px] mx-auto px-6 py-10 sm:px-4 sm:py-6">
        {children}
      </main>
    </div>
  );
};
