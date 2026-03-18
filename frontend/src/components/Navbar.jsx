import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/books', label: 'Catalog' },
    { to: '/books/add', label: 'Add Book' },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 text-slate-900 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-sm font-bold text-amber-900">
              LM
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">LibraryMS</p>
              <p className="text-xs text-slate-500">Library admin panel</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-5">
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to)

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
