import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SOX UAR Audit Mockup',
  description: 'AI Recertification · SOX UAR interactive mockup',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
