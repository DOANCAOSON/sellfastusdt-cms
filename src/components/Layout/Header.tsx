import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined'
import Button from 'antd/es/button'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import NotificationDropdown from './NotificationDropdown'
import ProfileMenu from './ProfileMenu'
import './layout.scss'

const Header = () => {
  function onToggle() {
    const body = document.body
    if (window.screen.width <= 998) {
      body.classList.toggle('sidebar-enable')
    } else {
      body.classList.toggle('vertical-collpsed')
      body.classList.toggle('sidebar-enable')
    }
  }

  return (
    <header id='page-topbar'>
      <div className='navbar-header'>
        <div className='d-flex'>
          <div className='navbar-brand-box text-center'>
            <Link to='/' className='logo logo-dark'>
              <span className='logo-sm'>
                <img src={logo} alt='logo-sm-dark' height='22' />
              </span>
            </Link>
          </div>

          <Button className='header-item noti-icon' icon={<MenuFoldOutlined />} onClick={onToggle} />
        </div>

        <div className='d-flex'>
          <NotificationDropdown />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
