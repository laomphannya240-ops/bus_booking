import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Compass, House, Undo2 } from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex max-w-2xl items-center px-4 py-16 sm:px-6">
      <Card className="w-full p-8 text-center sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
          <Compass size={38} />
        </div>
        <p className="mt-6 text-6xl font-black tracking-tight text-brand-600 dark:text-brand-300">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{t('errors.notFoundTitle')}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{t('errors.notFoundText')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/" icon={House}>{t('errors.goHome')}</Button>
          <Button variant="outline" icon={Undo2} onClick={() => navigate(-1)}>{t('common.back')}</Button>
        </div>
      </Card>
    </div>
  )
}
