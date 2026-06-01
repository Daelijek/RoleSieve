import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hhresearch.local"),
  title: {
    default: "hhResearch — анализ вакансий HH для улучшения резюме",
    template: "%s · hhResearch",
  },
  description:
    "Превращаем вакансии HeadHunter в понятный план улучшения резюме: ключевые навыки, частотные фразы и чистый Excel-отчёт за минуты.",
  applicationName: "hhResearch",
  keywords: [
    "hh",
    "headhunter",
    "вакансии",
    "анализ вакансий",
    "ключевые навыки",
    "резюме",
    "карьера",
    "рынок труда",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "hhResearch — анализ вакансий HH",
    description:
      "Понять рынок и улучшить резюме на основе реальных требований из вакансий HeadHunter.",
    siteName: "hhResearch",
  },
  twitter: {
    card: "summary_large_image",
    title: "hhResearch — анализ вакансий HH",
    description:
      "Понять рынок и улучшить резюме на основе реальных требований из вакансий HeadHunter.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07070c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5fb" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["dark", "light"]}
          enableSystem={false}
        >
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
