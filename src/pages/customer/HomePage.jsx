import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, BadgeCheck, CircleDollarSign, Headphones, MapPinned,
  Quote, ShieldCheck, Star, Users,
} from 'lucide-react'
import SearchForm from '../../components/booking/SearchForm'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import CompanyLogo from '../../components/bus/CompanyLogo'
import BusIllustration from '../../components/bus/BusIllustration'
import DestinationArt from '../../components/bus/DestinationArt'
import { useApp } from '../../context/AppContext'
import { useBooking } from '../../context/BookingContext'
import { companies } from '../../data/companies'
import { provinces } from '../../data/provinces'
import { routes } from '../../data/routes'
import { reviews } from '../../data/reviews'
import { platformStatistics } from '../../data/dashboard'
import { money } from '../../utils/format'

export default function HomePage() {
  const { t } = useTranslation()
  const { language } = useApp()
  const { updateSearch } = useBooking()
  const navigate = useNavigate()

  const destinations = [21, 16, 3, 8, 11, 24].map((id) => {
    const province = provinces.find((item) => item.id === id)
    const route = routes.find((item) => item.fromProvinceId === 1 && item.toProvinceId === id)
    return { province, price: route?.basePrice || 12 }
  })

  const goTo = (to) => {
    updateSearch({ from: 1, to, date: new Date().toISOString().slice(0, 10), passengers: 1 })
    navigate('/search')
  }

  const features = [
    { icon: MapPinned, title: t('home.why1Title'), text: t('home.why1Text') },
    { icon: BadgeCheck, title: t('home.why2Title'), text: t('home.why2Text') },
    { icon: CircleDollarSign, title: t('home.why3Title'), text: t('home.why3Text') },
    { icon: Headphones, title: t('home.why4Title'), text: t('home.why4Text') },
  ]

  const stats = [
    { value: `${platformStatistics.provinces}`, label: t('home.stat1') },
    { value: platformStatistics.trips, label: t('home.stat2') },
    { value: platformStatistics.passengers, label: t('home.stat3') },
    { value: `${platformStatistics.companies}+`, label: t('home.stat4') },
  ]

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 pb-28 pt-12 text-white sm:pb-32 sm:pt-16">
        <div className="hero-pattern absolute inset-0" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="chip border border-white/15 bg-white/10 text-white">
              <ShieldCheck size={13} className="text-brand-300" /> {t('home.badge')}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.heroTitle1')}<br />
              <span className="text-brand-300">{t('home.heroTitle2')}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t('home.heroSubtitle')}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
              <span className="flex items-center gap-2"><MapPinned size={16} className="text-brand-300" /> 25 {t('common.province')}</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-brand-300" /> 850K+ {t('common.passengers')}</span>
              <span className="flex items-center gap-2"><Star size={16} className="fill-amber-400 text-amber-400" /> 4.8 / 5</span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-3xl opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between text-xs text-white/60">
                  <span>PHNH PENH → SIEM REAP</span>
                  <span className="chip bg-emerald-400/15 text-emerald-300">VIP 48 seats</span>
                </div>
                <BusIllustration company={companies[0]} type="VIP" plate="AA 1234" className="drop-shadow-2xl" />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    ['06:30', 'Departure'],
                    ['5h 15m', 'Duration'],
                    ['11:45', 'Arrival'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-sm font-bold">{value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-8 rounded-2xl border border-white/10 bg-navy-900 px-4 py-3 shadow-float">
              <p className="text-xs text-white/60">{t('common.status')}</p>
              <p className="flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {t('common.active')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-20 max-w-7xl px-4 sm:-mt-24 sm:px-6 lg:px-8">
        <Card className="p-4 shadow-float sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><MapPinned size={17} /></span>
            <h2 className="text-base font-extrabold">{t('home.searchTitle')}</h2>
          </div>
          <SearchForm />
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('home.popularSubtitle')}
          title={t('home.popularTitle')}
          action={<Button variant="ghost" to="/search">{t('nav.findBus')} <ArrowRight size={15} /></Button>}
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map(({ province, price }) => (
            <button
              key={province.id}
              type="button"
              onClick={() => goTo(province.id)}
              className="group app-card overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="h-28 overflow-hidden"><DestinationArt hue={195 + (province.id % 5) * 22} /></div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{province[language] || province.en}</p>
                  <p className="mt-0.5 text-xs text-muted">{t('home.fromPrice')} {money(price)}</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300">
                  <ArrowRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="border-y py-14" style={{ background: 'var(--surface)', borderColor: 'var(--border-color)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t('brand.tagline')} title={t('home.companiesTitle')} subtitle={t('home.companiesSubtitle')} />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.slice(0, 8).map((company) => (
              <Card key={company.id} className="flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-float">
                <CompanyLogo company={company} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{company.name[language] || company.name.en}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted"><Star size={11} className="fill-amber-400 text-amber-400" /> {company.rating} · {company.trips} {t('admin.unitTrips')}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('home.whySubtitle')} title={t('home.whyTitle')} align="center" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300"><Icon size={21} /></span>
              <h3 className="mt-4 text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-navy-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t('home.statsSubtitle')} title={t('home.statsTitle')} align="center" />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:p-5">
                <p className="text-2xl font-extrabold text-brand-300 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('home.reviewsSubtitle')} title={t('home.reviewsTitle')} align="center" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <Card key={review.id} className="flex h-full flex-col p-5">
              <Quote size={22} className="text-brand-300" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">“{review.text[language] || review.text.en}”</p>
              <div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: review.color }}>
                  {(review.name[language] || review.name.en).slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{review.name[language] || review.name.en}</p>
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={11} className={index < review.rating ? 'fill-amber-400' : 'opacity-30'} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-brand-600 px-5 py-8 text-white sm:px-10">
          <div>
            <h2 className="text-2xl font-extrabold">{t('home.ctaTitle')}</h2>
            <p className="mt-1.5 text-sm text-white/80">{t('home.ctaSubtitle')}</p>
          </div>
          <Button variant="outline" to="/search" size="lg" className="w-full !border-white !bg-white !text-brand-700 sm:w-auto">
            {t('home.ctaButton')} <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  )
}
