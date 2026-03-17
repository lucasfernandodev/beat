import { useLocation } from 'react-router';
import { Link } from '../../infra/link';
import S from './style.module.css';
import { IconHome, IconSettings, IconHomeFilled, IconSettingsFilled } from '@tabler/icons-react'

export const Navigation = () => {

  const { pathname } = useLocation();

  return (
    <nav className={S.nav}>
      <ul className={S.menu}>
        <li className={S.option}>
          <Link to="/" className={S.link} data-active={pathname === '/'}>
            {pathname === '/' ? <IconHomeFilled /> : <IconHome />}
          </Link>
        </li>
        <li className={S.option}>
          <Link to="/settings" className={S.link} data-active={pathname === '/settings'}>
            {pathname === '/settings' ? <IconSettingsFilled /> : <IconSettings />}
          </Link>
        </li>
      </ul>
    </nav>
  )
}