import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Income Tax Calculator FY 2025-26',
  description: 'This project is a Javascript-based tax calculator that computes the income tax liability based on a predefined slab system. It applies a rebate for incomes up to ₹12L and calculates progressive taxation for higher incomes. Users can input their annual income, and the program returns the applicable tax amount.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
