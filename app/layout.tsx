import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'סוכן הכתיבה של דני ברקאי | DANBAR',
  description: 'פלטפורמת כתיבה אסטרטגית ויוקרתית בסגנון החתום של דני ברקאי — DANBAR ייעוץ אסטרטגי, ארגוני ומשאבי אנוש',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&family=Heebo:wght@300;400;500;600;700;800;900&family=Frank+Ruhl+Libre:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080d17] text-slate-100 min-h-screen antialiased selection:bg-danbar-500/30 selection:text-danbar-200">
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(115,151,14,0.18),transparent_70%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.06),transparent_50%),radial-gradient(circle_at_10%_80%,rgba(115,151,14,0.08),transparent_60%)]" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

