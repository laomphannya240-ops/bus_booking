import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BusFront, ChevronDown, Globe2, LayoutDashboard, LogOut, Menu, Moon,
  Ticket, UserRound, X, Sun, Building2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ROLES } from '../../constants'
import { cn } from '../../utils/format'
import Avatar from '../common/Avatar'

const navItemClass = ({ isActive }) =>
  cn(
    'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'text-brand-600 dark:text-brand-300'
      : 'text-muted hover:text-[var(--text-main)]',
  )

export default function Navbar() {
  const { t } = useTranslation()
  const { language, setLanguage, theme, toggleTheme, user, logout } = useApp()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const isAdmin = user?.role === ROLES.ADMIN
  const isCompany = user?.role === ROLES.COMPANY

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/search', label: t('nav.findBus') },
    ...(user ? [{ to: '/my-bookings', label: t('nav.myBookings') }] : []),
    ...(isAdmin ? [{ to: '/admin', label: t('nav.dashboard') }] : []),
    ...(isCompany ? [{ to: '/company', label: t('nav.companyPanel') }] : []),
  ]

  const closeMenus = () => {
    setMobileOpen(false)
    setLanguageOpen(false)
    setUserOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    closeMenus()
    navigate('/')
  }

  return (
    <header className="no-print sticky top-0 z-50 border-b backdrop-blur-xl" style={{ background: 'color-mix(in srgb, var(--surface) 92%, transparent)', borderColor: 'var(--border-color)' }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMenus}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white shadow-sm">
            <BusFront size={20} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-extrabold tracking-tight sm:text-base">CAMBODIA BUS</span>
            <span className="hidden text-[10px] font-medium text-muted sm:block">{t('brand.tagline')}</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navItemClass} onClick={closeMenus}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              className="btn-ghost !px-2.5 !py-2"
              onClick={() => { setLanguageOpen((open) => !open); setUserOpen(false) }}
              aria-label={t('nav.language')}
              aria-expanded={languageOpen}
            >
              <Globe2 size={17} />
              <span className="hidden text-xs font-bold uppercase min-[380px]:inline">{language}</span>
              <ChevronDown size={13} />
            </button>
            {languageOpen && (
              <>
                <button type="button" className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setLanguageOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl p-1 shadow-float" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                  {[
                    { code: 'km', label: 'ភាសាខ្មែរ' },
                    { code: 'en', label: 'English' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.code}
                      onClick={() => { setLanguage(item.code); setLanguageOpen(false) }}
                      className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm', language === item.code ? 'bg-brand-50 font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : 'hover:bg-[var(--surface-muted)]')}
                    >
                      {item.label}
                      {language === item.code && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button type="button" onClick={toggleTheme} className="btn-ghost !p-2.5" aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => { setUserOpen((open) => !open); setLanguageOpen(false) }}
                className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-[var(--surface-muted)]"
                aria-expanded={userOpen}
              >
                <Avatar name={user.name?.en || user.name || 'User'} color={user.color} size="sm" />
                <ChevronDown size={14} className="hidden sm:block" />
              </button>
              {userOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-10 cursor-default" aria-label="Close" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl p-1 shadow-float" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                    <div className="border-b px-3 py-2.5" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="truncate text-sm font-bold">{user.name?.en || user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <NavLink to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-muted)]" onClick={closeMenus}>
                      <UserRound size={15} /> {t('nav.profile')}
                    </NavLink>
                    <NavLink to="/my-bookings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-muted)]" onClick={closeMenus}>
                      <Ticket size={15} /> {t('nav.myBookings')}
                    </NavLink>
                    {(isAdmin || isCompany) && (
                      <NavLink to={isAdmin ? '/admin' : '/company'} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--surface-muted)]" onClick={closeMenus}>
                        {isAdmin ? <LayoutDashboard size={15} /> : <Building2 size={15} />}
                        {isAdmin ? t('nav.adminPanel') : t('nav.companyPanel')}
                      </NavLink>
                    )}
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink to="/login" variant="ghost">{t('nav.login')}</ButtonLink>
              <ButtonLink to="/register" variant="primary">{t('nav.register')}</ButtonLink>
            </div>
          )}

          <button type="button" className="btn-ghost !p-2.5 lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label={t('nav.menu')}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="no-scrollbar max-h-[calc(100vh-4rem)] overflow-y-auto border-t px-4 py-3 lg:hidden" style={{ borderColor: 'var(--border-color)', background: 'var(--surface)' }}>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={navItemClass} onClick={closeMenus}>
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <ButtonLink to="/login" variant="outline" className="flex-1">{t('nav.login')}</ButtonLink>
                <ButtonLink to="/register" variant="primary" className="flex-1">{t('nav.register')}</ButtonLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

function ButtonLink({ to, variant, children, className }) {
  return <Link to={to} className={cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', className)}>{children}</Link>
}
