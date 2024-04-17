import { ReactNode, useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'
import './layout.scss'

const Layout = (props: { children: ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div id='layout-wrapper'>
      <Header />
      <Sidebar />
      <div className='main-content'>
        <div className='page-content'>{props.children}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
