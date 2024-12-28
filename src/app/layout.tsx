import './globals.css'
import { Inter } from 'next/font/google'
import CustomCursor from './components/custom-cursor'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Interactive Floating Image Gallery',
  description: 'A creative and highly interactive floating image gallery that responds to cursor and touch movement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} sm:cursor-none`}>
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}

