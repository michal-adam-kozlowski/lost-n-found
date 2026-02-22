import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LostNFound',
  description: 'Virtual lost-and-found office',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-6">
            <span className="text-xl font-bold text-blue-600">LostNFound</span>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Browse Items
              </a>
              <a href="/new" className="text-gray-600 hover:text-blue-600 transition-colors">
                Report Item
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
