import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Building2, Globe2, Moon, Palette, Save, Sun, UserRound } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CONTACT } from '../../constants'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { language, setLanguage, theme, setTheme, toast } = useApp()
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    reset({ siteName: 'CAMBODIA BUS', tagline: t('brand.tagline'), email: CONTACT.email, phone: CONTACT.phone })
  }, [reset, t])

  const save = () => toast.success(t('common.saveDemo'))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">{t('admin.settings')}</h2>
        <p className="mt-1 text-sm text-muted">{t('admin.panelSubtitle')}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Building2 size={18} className="text-brand-600" /><h3 className="font-bold">{t('admin.siteInfo')}</h3></div>
          <form onSubmit={handleSubmit(save)} className="space-y-4">
            <FormField label={t('admin.siteName')}><input className="input-base" {...register('siteName')} /></FormField>
            <FormField label={t('admin.siteTagline')}><input className="input-base" {...register('tagline')} /></FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t('admin.contactEmail')}><input type="email" className="input-base" {...register('email')} /></FormField>
              <FormField label={t('admin.contactPhone')}><input className="input-base" {...register('phone')} /></FormField>
            </div>
            <Button type="submit" icon={Save}>{t('common.save')}</Button>
          </form>
          <p className="mt-3 text-xs text-muted">{t('common.demoNotice')}</p>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2"><Globe2 size={18} className="text-brand-600" /><h3 className="font-bold">{t('admin.languageSettings')}</h3></div>
            <div className="grid grid-cols-2 gap-3">
              {[{ code: 'km', label: 'ភាសាខ្មែរ' }, { code: 'en', label: 'English' }].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`rounded-xl border p-4 text-left text-sm font-bold ${language === item.code ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : ''}`}
                  style={language !== item.code ? { borderColor: 'var(--border-color)' } : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{t('admin.defaultLanguage')}: {language === 'km' ? 'ភាសាខ្មែរ' : 'English'}</p>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2"><Palette size={18} className="text-brand-600" /><h3 className="font-bold">{t('admin.themeSettings')}</h3></div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setTheme('light')} className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-bold ${theme === 'light' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : ''}`} style={theme !== 'light' ? { borderColor: 'var(--border-color)' } : undefined}>
                <Sun size={17} /> Light
              </button>
              <button type="button" onClick={() => setTheme('dark')} className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-bold ${theme === 'dark' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200' : ''}`} style={theme !== 'dark' ? { borderColor: 'var(--border-color)' } : undefined}>
                <Moon size={17} /> Dark
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">{t('admin.defaultTheme')}: {theme}</p>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2"><UserRound size={18} className="text-brand-600" /><h3 className="font-bold">{t('admin.adminProfile')}</h3></div>
            <Button variant="outline" to="/profile">{t('nav.profile')}</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
