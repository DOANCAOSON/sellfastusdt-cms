import { enableLegendStateReact } from '@legendapp/state/react'
import { FC, Suspense, lazy, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Fallback from './components/Fallback'
import { useAppStore } from './store/app-store'
import './styles/css/bootstrap.css'
import './styles/css/main.css'
enableLegendStateReact()

const Authorized = lazy(() => import('./pages/Authorized'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))

const App: FC = () => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const isAuthorized = useAppStore((store) => store.isAuthorized)

  useEffect(() => {
    if (!isAuthorized && !pathname.includes('/auth/login')) {
      navigate('/auth/login' + (pathname !== '/' ? `?redirectTo=${encodeURIComponent(`${pathname}${search}`)}` : ''), {
        replace: true
      })
    } else if (isAuthorized && pathname.includes('/auth/login')) {
      const query = new URLSearchParams(search)
      navigate(query.get('redirectTo') || '/', { replace: true })
    }
  }, [])

  return <Suspense fallback={<Fallback />}>{isAuthorized ? <Authorized /> : <Unauthorized />}</Suspense>
}

export default App
