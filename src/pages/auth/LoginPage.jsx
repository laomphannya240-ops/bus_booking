import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { authService } from '../../services/authService'
import { ROLES } from '../../constants'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import FormField from '../../components/common/FormField'
import Avatar from '../../components/common/Avatar'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm()
  const language = i18n.language.startsWith('km') ? 'km' : 'en'

  const finish = (user) => {
    toast.success(t('auth.loginButton'))
    const requested = location.state?.from
    const roleHome = user.role === ROLES.ADMIN ? '/admin' : user.role === ROLES.COMPANY ? '/company' : '/'
    navigate(requested || roleHome, { replace: true })
  }

  const submit = async (values) => {
    try {
      finish(await login(values))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const signInDemo = async (email) => {
    setValue('email', email)
    setValue('password', 'demo1234')
    try {
      finish(await login({ email, password: 'demo1234' }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight">{t('auth.loginTitle')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('auth.loginSubtitle')}</p>

      <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
        <FormField label={t('auth.emailField')} required error={errors.email?.message}>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="email" className="input-base !pl-9" {...register('email', { required: t('booking.requiredError') })} />
          </div>
        </FormField>
        <FormField label={t('auth.passwordField')} required error={errors.password?.message}>
          <div className="relative">
            <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="password" className="input-base !pl-9" {...register('password', { required: t('booking.requiredError') })} />
          </div>
        </FormField>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="h-4 w-4 accent-brand-600" /> {t('auth.rememberMe')}
          </label>
          <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs font-semibold text-brand-600 hover:underline">
            {t('auth.forgotPassword')}
          </button>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting} icon={ArrowRight}>
          {t('auth.loginButton')}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {t('auth.noAccount')} <button type="button" onClick={() => navigate('/register')} className="font-bold text-brand-600 hover:underline">{t('auth.signUp')}</button>
      </p>

      <div className="mt-6 rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--surface-muted)' }}>
        <p className="text-xs font-bold">{t('auth.demoTitle')}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">{t('auth.demoHint')}</p>
        <div className="mt-3 space-y-2">
          {authService.demoAccounts().map((account) => (
            <button
              type="button"
              key={account.id}
              onClick={() => signInDemo(account.email)}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[var(--surface)]"
            >
              <Avatar name={account.name[language] || account.name.en} color={account.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{t(account.role === ROLES.ADMIN ? 'auth.demoAdmin' : account.role === ROLES.COMPANY ? 'auth.demoCompany' : 'auth.demoCustomer')}</p>
                <p className="truncate text-[10px] text-muted">{account.email}</p>
              </div>
              <span className="text-[10px] font-bold text-brand-600">{t('auth.useAccount')}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  )
}
