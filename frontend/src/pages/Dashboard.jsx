// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

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

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (error)   return <p className="text-red-500">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-blue-50 border border-blue-200 rounded p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Total Books</p>
          <p className="text-4xl font-bold text-blue-600">{stats.totalBooks}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Available Books</p>
          <p className="text-4xl font-bold text-green-600">{stats.availableBooks}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Issued Books</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.issuedBooks}</p>
        </div>

      </div>

      {/* Recent Issues Table */}
      <h2 className="text-lg font-semibold mb-3">Currently Issued Books</h2>

      {stats.recentIssues.length === 0 ? (
        <p className="text-gray-400">No books currently issued.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Book Title</th>
              <th className="border px-4 py-2 text-left">Issued To</th>
              <th className="border px-4 py-2 text-left">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentIssues.map(issue => (
              <tr key={issue.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{issue.book_title}</td>
                <td className="border px-4 py-2">{issue.username}</td>
                <td className="border px-4 py-2 text-gray-500">
                  {new Date(issue.issue_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  )
}