import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Stepper | BS Climbing - Custom Crimp Block',
  description: 'Design din egen crimp block – millimeter for millimeter. Velg mål, se preview, print selv.',
  keywords: ['klatring', 'crimp', 'hangboard', 'treningsutstyr', '3D print', 'custom', 'BS Climbing'],
  authors: [{ name: 'BS Climbing' }],
  openGraph: {
    title: 'Stepper | BS Climbing',
    description: 'Design din egen crimp block – millimeter for millimeter.',
    type: 'website',
    locale: 'nb_NO',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb" className={inter.variable}>
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}
