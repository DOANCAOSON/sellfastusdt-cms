import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import user1 from '../../assets/images/users/avatar-1.jpg'
import { auth } from '../../helper-plugin'
import { useAppStore } from '../../store/app-store'

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false)
  const app = useAppStore()
  const userInfo = auth.getUserInfo()

  const onLogout = async () => {
    auth.clearToken()
    auth.clearUserInfo()
    app.logout()
  }

  return (
    <Fragment>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className='d-inline-block'>
        <DropdownToggle className='btn header-item ' id='page-header-user-dropdown' tag='button'>
          <img className='rounded-circle header-profile-user' src={user1} alt='Header Avatar' />
          <span className='d-none d-xl-inline-block ms-2 me-2'>{userInfo?.name}</span>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <DropdownItem tag='a' href='/me'>
            <i className='ri-user-line align-middle me-2' />
            {'Profile'}
          </DropdownItem>
          <div className='dropdown-divider' />
          <Link to='#' className='dropdown-item' onClick={onLogout}>
            <i className='ri-shut-down-line align-middle me-2 text-danger' />
            <span>{'Logout'}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </Fragment>
  )
}

export default ProfileMenu
