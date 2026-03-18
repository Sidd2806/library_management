import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboard()
        setStats(data)
      } catch {
        setError('Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>
  if (error) return <p className="max-w-md rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-[0.92rem] text-rose-700">{error}</p>

  return (
    <div className="space-y-8">
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex w-fit items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">Overview</div>
          <h1 className="font-['Playfair_Display'] text-4xl leading-tight text-slate-900 sm:text-[3.25rem]">Library Dashboard</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Monitor collection health, keep an eye on circulation, and review the books that are currently checked out.
          </p>
          {user.username && (
            <p className="mt-4 text-sm font-medium text-slate-700">
              Logged in as <span className="text-slate-900">{user.username}</span>
            </p>
          )}
        </div>

        <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
          {stats.issuedBooks > 0 ? `${stats.issuedBooks} book(s) currently issued` : 'All books are currently in the library'}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Books</p>
          <p className="mt-4 text-4xl font-bold text-[#2c5f95]">{stats.totalBooks}</p>
          <p className="mt-3 text-sm text-slate-500">Every title currently stored in the catalog.</p>
        </div>  

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Available Books</p>
          <p className="mt-4 text-4xl font-bold text-[#2d8b67]">{stats.availableBooks}</p>
          <p className="mt-3 text-sm text-slate-500">Copies ready to issue right now without waiting for returns.</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Issued Books</p>
          <p className="mt-4 text-4xl font-bold text-[#bf7b33]">{stats.issuedBooks}</p>
          <p className="mt-3 text-sm text-slate-500">Items currently checked out by readers or staff members.</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="flex flex-col gap-2 border-b border-slate-200/70 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Currently Issued Books</h2>
            <p className="mt-1 text-sm text-slate-500">Recent circulation activity for books that have not yet been returned.</p>
          </div>
          <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-slate-600">{stats.recentIssues.length} active issue record(s)</div>
        </div>

        {stats.recentIssues.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-800">No books are currently issued.</p>
            <p className="mt-2 text-sm text-slate-500">Once a reader checks out a title, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-180 w-full border-separate border-spacing-0 text-left text-[0.92rem]">
              <thead>
                <tr>
                  <th className="border-b border-[rgba(34,42,61,0.1)] px-4 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-500">Book Title</th>
                  <th className="border-b border-[rgba(34,42,61,0.1)] px-4 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-500">Issued To</th>
                  <th className="border-b border-[rgba(34,42,61,0.1)] px-4 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-500">Issue Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-white/50">
                    <td className="border-b border-[rgba(34,42,61,0.08)] px-4 py-4 font-semibold text-slate-900">{issue.book_title || issue.title || 'Untitled book'}</td>
                    <td className="border-b border-[rgba(34,42,61,0.08)] px-4 py-4">{issue.username}</td>
                    <td className="border-b border-[rgba(34,42,61,0.08)] px-4 py-4 text-slate-500">
                      {new Date(issue.issue_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
