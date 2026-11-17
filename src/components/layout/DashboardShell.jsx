import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BusFront, ChevronDown, Globe2, LogOut, Menu, Moon, Sun, UserRound, X,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'
import Avatar from '../common/Avatar'

export default function DashboardShell({ groups, title, subtitle }) {
  const { t } = useTranslation()
  const { user, logout, language, setLanguage, theme, toggleTheme } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      {sidebarOpen && (
        <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          'no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ background: 'var(--surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex h-16 items-center gap-2.5 border-b px-5" style={{ borderColor: 'var(--border-color)' }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"><BusFront size={20} /></span>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">CAMBODIA BUS</p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">{title}</p>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className="btn-ghost !p-1.5 lg:hidden"><X size={18} /></button>
        </div>

        <nav className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
                        : 'text-muted hover:bg-[var(--surface-muted)] hover:text-[var(--text-main)]',
                    )}
                  >
                    <item.icon size={18} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t p-4" style={{ borderColor: 'var(--border-color)' }}>
          <div className="rounded-xl px-3 py-2.5 text-xs leading-relaxed text-muted" style={{ background: 'var(--surface-muted)' }}>
            {t('common.demoNotice')}
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6" style={{ background: 'color-mix(in srgb, var(--surface) 92%, transparent)', borderColor: 'var(--border-color)' }}>
          <button type="button" className="btn-ghost !p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><Menu size={20} /></button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold sm:text-lg">{title}</h1>
            <p className="hidden truncate text-xs text-muted sm:block">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => setLanguage(language === 'km' ? 'en' : 'km')} className="btn-ghost !px-2.5 !py-2" aria-label={t('nav.language')}>
              <Globe2 size={17} /> <span className="text-xs font-bold uppercase">{language}</span>
            </button>
            <button type="button" onClick={toggleTheme} className="btn-ghost !p-2.5" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button type="button" onClick={() => setUserOpen((open) => !open)} className="flex items-center gap-2 rounded-xl p-1 hover:bg-[var(--surface-muted)]">
                <Avatar name={user?.name?.en || user?.name || 'User'} color={user?.color} size="sm" />
                <ChevronDown size={14} className="hidden sm:block" />
              </button>
              {userOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl p-1 shadow-float" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                    <div className="border-b px-3 py-2" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="truncate text-sm font-bold">{user?.name?.en || user?.name}</p>
                      <p className="truncate text-xs text-muted">{user?.email}</p>
                    </div>
                    <NavLink to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-muted)]">
                      <UserRound size={15} /> {t('nav.profile')}
                    </NavLink>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main key={location.pathname} className="page-enter p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
