import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { House, LayoutDashboard, ShieldAlert, Undo2 } from 'lucide-react'
import { ROLES } from '../../constants'
import { useApp } from '../../context/AppContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function ForbiddenPage() {
  const { t } = useTranslation()
  const { user } = useApp()
  const navigate = useNavigate()

  const panelLink = user?.role === ROLES.ADMIN
    ? { to: '/admin', label: t('nav.adminPanel') }
    : user?.role === ROLES.COMPANY
      ? { to: '/company', label: t('nav.companyPanel') }
      : null

  return (
    <div className="mx-auto flex max-w-2xl items-center px-4 py-16 sm:px-6">
      <Card className="w-full p-8 text-center sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
          <ShieldAlert size={38} />
        </div>
        <p className="mt-6 text-6xl font-black tracking-tight text-red-500 dark:text-red-400">403</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{t('errors.forbiddenTitle')}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{t('errors.forbiddenText')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/" icon={House}>{t('errors.goHome')}</Button>
          {panelLink && <Button to={panelLink.to} variant="soft" icon={LayoutDashboard}>{panelLink.label}</Button>}
          <Button variant="outline" icon={Undo2} onClick={() => navigate(-1)}>{t('common.back')}</Button>
        </div>
      </Card>
    </div>
  )
}
