import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'סוכן הכתיבה של דני ברקאי | DANBAR',
  description: 'כתיבת פוסטים, בלוגים ומאמרים בסגנון החתום של דני ברקאי ו-DANBAR',
  icons: {
    icon: '/danbar-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body className="h-full font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-danbar-950">
        {children}
      </body>
    </html>
  );
}
