import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SeenFlix',
  description: 'Showcase your watched Movies and TV Shows',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <ClerkProvider afterSignOutUrl='/'>
        <body className={`${inter.className} bg-gray-900 text-gray-100`}>{children}</body>
      </ClerkProvider>
    </html>
  )
}

