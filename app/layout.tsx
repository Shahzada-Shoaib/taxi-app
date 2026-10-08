import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { whatsappHref } from "./site-config";
import "./globals.css";
import "./interactions.css";
import "./contact-fleet.css";
import "./layout-spacing.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Black Country Mini Bus | UK Taxi Journeys, Airport Transfers & Chauffeur Hire",
  description: "Discover premium UK taxi journeys, airport transfers and chauffeur hire with BCM. Plan your trip using a UK postcode and view example fares in GBP.",
  verification: {
    google: "Thw3VeZ66e_y7Ik2jHy_EZvGEMNjhB2TGEt7xdnlBIA",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Browser extensions can inject body attributes before React hydrates. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        {whatsappHref && <a className="floating-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Chat on WhatsApp">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.24-1.64a11.94 11.94 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.48-8.41ZM12.05 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.9 9.9 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.93-9.92a9.85 9.85 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.03c0 5.47-4.45 9.92-9.97 9.85Z" />
            <path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.39-1.47-.89-.79-1.48-1.77-1.65-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.73 2.02-1.44.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          </svg>
        </a>}
      </body>
    </html>
  );
}
