import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { authService } from '../../services/authService'
import { formatDate } from '../../utils/date'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import FormField from '../../components/common/FormField'
import { ROLES } from '../../constants'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, setUser, toast } = useApp()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
    else reset({ name: user.name?.en || user.name || '', phone: user.phone || '', email: user.email || '' })
  }, [user, navigate, reset])

  if (!user) return null

  const save = async (values) => {
    const updated = await authService.updateProfile({ name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim() })
    setUser(updated)
    toast.success(t('common.saveDemo'))
  }

  const roleLabel = user.role === ROLES.ADMIN ? t('admin.panel')
    : user.role === ROLES.COMPANY ? t('auth.demoCompany') : t('auth.demoCustomer')

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: t('nav.profile') }]} />
      <div className="mt-5">
        <h1 className="text-2xl font-extrabold tracking-tight">{t('account.profileTitle')}</h1>
        <p className="mt-1 text-sm text-muted">{t('account.profileSubtitle')}</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit p-6 text-center">
          <Avatar name={user.name?.en || user.name || 'User'} color={user.color} size="lg" className="mx-auto" />
          <h2 className="mt-4 text-lg font-extrabold">{user.name?.en || user.name}</h2>
          <p className="text-sm text-muted">{user.email}</p>
          <div className="mt-4 flex justify-center"><Badge tone="brand" dot>{roleLabel}</Badge></div>
          <div className="mt-6 space-y-3 border-t pt-5 text-left text-sm" style={{ borderColor: 'var(--border-color)' }}>
            <p className="flex items-center gap-2 text-muted"><Phone size={15} /> {user.phone || '—'}</p>
            <p className="flex items-center gap-2 text-muted"><CalendarDays size={15} /> {t('account.memberSince')}: {formatDate(user.joinedAt)}</p>
            <p className="flex items-center gap-2 text-muted"><ShieldCheck size={15} /> {t('common.status')}: {t(`common.${String(user.status || 'ACTIVE').toLowerCase()}`)}</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <UserRound size={18} className="text-brand-600" />
            <h2 className="font-bold">{t('account.personalInfo')}</h2>
          </div>
          <form onSubmit={handleSubmit(save)} className="grid gap-4 sm:grid-cols-2">
            <FormField label={t('booking.fullName')} required error={errors.name?.message} className="sm:col-span-2">
              <input className="input-base" {...register('name', { required: t('booking.requiredError') })} />
            </FormField>
            <FormField label={t('booking.emailAddress')} required error={errors.email?.message}>
              <input type="email" className="input-base" {...register('email', {
                required: t('booking.requiredError'),
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('booking.emailError') },
              })} />
            </FormField>
            <FormField label={t('booking.phoneNumber')}>
              <input className="input-base" {...register('phone')} />
            </FormField>
            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
              <Button type="submit" icon={UserRound}>{t('account.saveProfile')}</Button>
              <Button variant="outline" to="/my-bookings">{t('account.bookingsTitle')}</Button>
              {(user.role === ROLES.ADMIN || user.role === ROLES.COMPANY) && (
                <Button variant="soft" to={user.role === ROLES.ADMIN ? '/admin' : '/company'}>
                  {user.role === ROLES.ADMIN ? t('nav.adminPanel') : t('nav.companyPanel')}
                </Button>
              )}
            </div>
          </form>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted"><Mail size={13} /> {t('common.demoNotice')}</p>
        </Card>
      </div>
    </div>
  )
}
