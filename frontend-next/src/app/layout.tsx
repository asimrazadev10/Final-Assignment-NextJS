import "./globals.css";
import Navigation from "@/ui/components/navigation";
import ScrollToTop from "@/ui/components/ScrollToTop";
import Footer from "@/ui/components/footer";
import ToastProvider from "@/lib/ToastProvider";
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: '%s | SubFlow',
    default: 'SubFlow',
  },
  description: 'Manage your subscriptions with ease using SubFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <ScrollToTop />
        <Navigation />
        {children}
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
