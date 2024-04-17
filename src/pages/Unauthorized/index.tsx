import { lazy, memo } from 'react'
import './unauthorized.scss'

const LoginPage = lazy(() => import('./Login'))

const Unauthorized = memo(
  () => {
    // return (
    //   <Suspense>
    //     <Routes>
    //       <Route path='/auth/:authType' element={<LoginPage />} />
    //     </Routes>
    //   </Suspense>
    // )
    return <LoginPage />
  },
  () => true
)

export default Unauthorized
