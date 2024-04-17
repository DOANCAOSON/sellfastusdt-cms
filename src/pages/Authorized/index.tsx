import { FC, Suspense, lazy, memo, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../../components/Layout'
import { cancelToken, getFetchClient } from '../../helper-plugin'
import { useAppStore } from '../../store/app-store'
import '../../styles/global.scss'

const Profile = lazy(() => import('./Profile'))
const DashboardPage = lazy(() => import('./Dashboard'))
const DetailPage = lazy(() => import('./Detail'))
const StaticPage = lazy(() => import('./Static'))
const Forbidden = lazy(() => import('../../components/Forbidden'))
const DataTable = lazy(() => import('../../components/DataTable'))

interface IState {
  isLoading: boolean
  menus: any[]
  routes: any[]
}

const InternalFallback = () => {
  return (
    <div className='InternalFallback'>
      <div className='lds'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

const Authorized: FC = memo(
  () => {
    const fetchClient = getFetchClient()
    const [state, setState] = useState<IState>({ isLoading: true, menus: [], routes: [] })
    const setMenu = useAppStore((store) => store.setMenu)
    const setSchemas = useAppStore((store) => store.setSchemas)
    const socketInit = useAppStore((store) => store.socketInit)

    useEffect(() => {
      socketInit()
    }, [])

    useEffect(() => {
      const source = cancelToken()
      Promise.all([
        fetchClient.get('/admin/schemas', { cancelToken: source.token }),
        fetchClient.get('/admin/init', { cancelToken: source.token })
      ]).then(([{ data: schemas }, { data: menuItems }]) => {
        setSchemas?.(schemas)
        setMenu?.(menuItems)
        const routeItems: any[] = []
        menuItems?.forEach(
          (m: ILayouts & { key: string; path: string; title: string; viewable: boolean; label: string }) => {
            if (m.key.startsWith('static-pages')) {
              routeItems.push(<Route key={m.path} path={m.path} element={<StaticPage {...m} />} />)
            } else {
              routeItems.push(<Route key={m.path} path={m.path} element={<DataTable uid={m.key} {...m} />} />)
              if (m.viewable !== false) {
                routeItems.push(
                  <Route
                    key={m.path + '/:id'}
                    path={m.path + '/:id'}
                    element={<DetailPage uid={m.key} notify={m.notify} />}
                  />
                )
              }
            }
          }
        )
        setState({ isLoading: false, menus: menuItems, routes: routeItems })
      })

      return () => source.cancel()
    }, [])

    if (state.isLoading) {
      return <></>
    }

    return (
      <Layout>
        <Suspense fallback={<InternalFallback />}>
          <Routes>
            <Route path='/' element={<DashboardPage />} />
            <Route path='/me' element={<Profile />} />
            {state.routes}
            <Route path='*' element={<Forbidden />} />
          </Routes>
        </Suspense>
      </Layout>
    )
  },
  () => true
)

export default Authorized
