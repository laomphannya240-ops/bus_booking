import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BusFront, Clock3, Mail, MapPin, Phone, Send, Share2, Video,
} from 'lucide-react'
import { CONTACT } from '../../constants'
import { useApp } from '../../context/AppContext'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { t, i18n } = useTranslation()
  const { toast } = useApp()
  const isKm = i18n.language.startsWith('km')
  const notify = () => toast.info(t('footer.demo'))

  const linkClass = 'block py-1.5 text-sm text-muted transition-colors hover:text-brand-600 dark:hover:text-brand-300'

  return (
    <footer className="no-print mt-auto border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border-color)' }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-white"><BusFront size={21} /></span>
            <div>
              <p className="font-extrabold tracking-tight">CAMBODIA BUS</p>
              <p className="text-xs text-muted">{t('brand.tagline')}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t('footer.aboutText')}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={notify} className="btn-outline !p-2.5" aria-label="Share"><Share2 size={16} /></button>
            <button type="button" onClick={notify} className="btn-outline !p-2.5" aria-label="Telegram"><Send size={16} /></button>
            <button type="button" onClick={notify} className="btn-outline !p-2.5" aria-label="Video"><Video size={16} /></button>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.quickLinks')}</h4>
          <Link to="/" className={linkClass}>{t('nav.home')}</Link>
          <Link to="/search" className={linkClass}>{t('nav.findBus')}</Link>
          <Link to="/my-bookings" className={linkClass}>{t('nav.myBookings')}</Link>
          <Link to="/login" className={linkClass}>{t('nav.login')}</Link>
          <Link to="/register" className={linkClass}>{t('nav.register')}</Link>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.support')}</h4>
          <button type="button" onClick={notify} className={linkClass}>{t('footer.helpCenter')}</button>
          <button type="button" onClick={notify} className={linkClass}>{t('footer.terms')}</button>
          <button type="button" onClick={notify} className={linkClass}>{t('footer.privacy')}</button>
          <button type="button" onClick={notify} className={linkClass}>{t('footer.cancellation')}</button>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold">{t('footer.contactUs')}</h4>
          <div className="space-y-3 text-sm text-muted">
            <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />{isKm ? CONTACT.addressKm : CONTACT.addressEn}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-brand-500" />{CONTACT.phone}</p>
            <p className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-brand-500" />{CONTACT.email}</p>
            <p className="flex items-center gap-2"><Clock3 size={16} className="shrink-0 text-brand-500" />{t('footer.hours')}</p>
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-5 text-center text-xs text-muted" style={{ borderColor: 'var(--border-color)' }}>
        © {CURRENT_YEAR} CAMBODIA BUS. {t('footer.rights')} {t('footer.demo')}
      </div>
    </footer>
  )
}
