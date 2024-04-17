import Icon from '@mdi/react'
import { Fragment, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { auth } from '../../helper-plugin'
import { useAppStore } from '../../store/app-store'
import sidebarData from './SidebarData'

const MenuItem = (i: { url: string; icon: string; label: ReactNode }) => {
  const { pathname } = useLocation()
  let isActive = false
  if (i.url === '/') {
    isActive = pathname === '/'
  } else {
    isActive = pathname.startsWith(i.url)
  }

  return (
    <li key={i.url} className={`${isActive && 'active'}`}>
      <Link to={i.url ? i.url : '/'}>
        <Icon className='mdi' path={i.icon} size={1} style={{ marginRight: '15px', paddingBottom: 5 }} />
        <span>{i.label}</span>
      </Link>
    </li>
  )
}

const Sidebar = () => {
  const menu = useAppStore((store) => store.menu)
  const userInfo = auth.getUserInfo()

  if (!menu) {
    return <></>
  }

  return (
    <div className='vertical-menu'>
      <div id='sidebar-menu'>
        <ul className='list-unstyled' id='side-menu-item'>
          {sidebarData.map((item, idx) => (
            <Fragment key={item.label + idx}>
              <li key={item.label + idx} className='menu-title'>
                {item.label}
              </li>
              {item.children.map((i: any) => {
                const link = menu.find((x) => x.key === i.key)
                if (!link) return null
                if (i['role'] && !userInfo?.roles?.includes(i['role'])) return null
                return <MenuItem key={link.path} icon={i.icon} label={link.label} url={link.path} />
              })}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
