import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'סוכן הכתיבה של דני ברקאי | DANBAR',
  description: 'אפליקציית כתיבת פוסטים, בלוגים ומאמרים בסגנון החתום והאותנטי של דני ברקאי (דילמות מעולמו של מנהל משאבי אנוש)',
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
    <html lang="he" dir="rtl">
      <body className="bg-[#f8fafc] text-slate-900 dark:bg-[#0b131e] dark:text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
