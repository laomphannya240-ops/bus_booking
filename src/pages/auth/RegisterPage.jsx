import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ArrowRight, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import FormField from '../../components/common/FormField'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register: registerUser, toast } = useApp()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const submit = async (values) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      })
      toast.success(t('auth.registerTitle'))
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight">{t('auth.registerTitle')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('auth.registerSubtitle')}</p>

      <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
        <FormField label={t('auth.nameField')} required error={errors.name?.message}>
          <div className="relative">
            <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input-base !pl-9" {...register('name', { required: t('booking.requiredError'), minLength: 2 })} />
          </div>
        </FormField>
        <FormField label={t('auth.emailField')} required error={errors.email?.message}>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="email" className="input-base !pl-9" {...register('email', {
              required: t('booking.requiredError'),
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('booking.emailError') },
            })} />
          </div>
        </FormField>
        <FormField label={t('auth.phoneField')} error={errors.phone?.message}>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input-base !pl-9" {...register('phone')} />
          </div>
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t('auth.passwordField')} required error={errors.password?.message}>
            <div className="relative">
              <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" className="input-base !pl-9" {...register('password', { required: t('booking.requiredError'), minLength: 6 })} />
            </div>
          </FormField>
          <FormField label={t('auth.confirmPassword')} required error={errors.confirmPassword?.message}>
            <div className="relative">
              <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="password" className="input-base !pl-9" {...register('confirmPassword', {
                required: t('booking.requiredError'),
                validate: (value) => value === watch('password') || t('auth.passwordMismatch'),
              })} />
            </div>
          </FormField>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting} icon={ArrowRight}>
          {t('auth.registerButton')}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        {t('auth.haveAccount')} <button type="button" onClick={() => navigate('/login')} className="font-bold text-brand-600 hover:underline">{t('auth.signIn')}</button>
      </p>
    </Card>
  )
}
