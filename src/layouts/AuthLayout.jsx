import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BusFront, CheckCircle2, Globe2, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const CURRENT_YEAR = new Date().getFullYear()

export default function AuthLayout() {
  const { t } = useTranslation()
  const { theme, toggleTheme, language, setLanguage } = useApp()
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 hero-pattern opacity-70" />
        <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><BusFront size={24} /></span>
            <div>
              <p className="font-extrabold tracking-tight">CAMBODIA BUS</p>
              <p className="text-xs text-white/60">{t('brand.tagline')}</p>
            </div>
          </Link>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">{t('auth.sideTitle')}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{t('auth.sideText')}</p>
          <div className="mt-8 space-y-3">
            {[t('home.why1Title'), t('home.why2Title'), t('home.why3Title')].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 size={17} className="text-brand-300" /> {item}
              </p>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/40">© {CURRENT_YEAR} CAMBODIA BUS</p>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-end gap-2 p-5">
          <button type="button" onClick={() => setLanguage(language === 'km' ? 'en' : 'km')} className="btn-ghost !px-3 !py-2" aria-label={t('nav.language')}>
            <Globe2 size={16} /> <span className="text-xs font-bold uppercase">{language}</span>
          </button>
          <button type="button" onClick={toggleTheme} className="btn-ghost !p-2.5" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/" className="btn-ghost !px-3 !py-2 text-xs font-semibold">{t('errors.goHome')}</Link>
        </div>
        <div key={location.pathname} className="page-enter flex flex-1 items-start justify-center px-5 pb-12 sm:items-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
