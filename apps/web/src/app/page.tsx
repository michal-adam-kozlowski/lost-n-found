'use client'

import { useEffect, useState } from 'react'

type ItemType = 'lost' | 'found'
type Filter = 'all' | ItemType

interface Item {
  id: string
  title: string
  type: ItemType
  description: string | null
  latitude: number | null
  longitude: number | null
  createdAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

const TYPE_STYLES: Record<ItemType, string> = {
  lost: 'bg-red-100 text-red-700',
  found: 'bg-green-100 text-green-700',
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/items`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Item[]>
      })
      .then(setItems)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold">Items</h2>
        <div className="flex gap-2">
          {(['all', 'lost', 'found'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-400">No items found.</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => (
          <li key={item.id} className="bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{item.title}</h3>
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[item.type]}`}
              >
                {item.type}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-gray-500">{item.description}</p>
            )}
            {(item.latitude !== null && item.longitude !== null) && (
              <p className="text-xs text-gray-400">
                📍 {item.latitude}, {item.longitude}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-auto">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
