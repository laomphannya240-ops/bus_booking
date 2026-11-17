import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Mail, Send } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import FormField from '../../components/common/FormField'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { toast } = useApp()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submit = () => {
    toast.success(t('auth.sentLink'))
    navigate('/login')
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight">{t('auth.forgotTitle')}</h1>
      <p className="mt-1.5 text-sm text-muted">{t('auth.forgotSubtitle')}</p>
      <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
        <FormField label={t('auth.emailField')} required error={errors.email?.message}>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="email" className="input-base !pl-9" {...register('email', {
              required: t('booking.requiredError'),
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('booking.emailError') },
            })} />
          </div>
        </FormField>
        <Button type="submit" size="lg" className="w-full" icon={Send}>{t('auth.sendLink')}</Button>
        <Button type="button" variant="ghost" className="w-full" icon={ArrowLeft} onClick={() => navigate('/login')}>
          {t('common.back')}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-muted">{t('common.demoNotice')}</p>
    </Card>
  )
}
