import { useLocation, useSearchParams } from 'react-router';
import { Link } from '../../infra/link';
import S from './style.module.css';
import { IconHome, IconSettings, IconHomeFilled, IconSettingsFilled, IconMenu, IconX } from '@tabler/icons-react'

export const Navigation = () => {

  const { pathname } = useLocation();

  const [params, setParams] = useSearchParams();

  const open = params.get("menu") === "1";

  const setOpen = (value: boolean) => {
    const newParams = new URLSearchParams(params);

    if (value) {
      newParams.set("menu", "1");
    } else {
      newParams.delete("menu");
    }

    setParams(newParams, { replace: true });
  };

  return (
    <nav className={S.nav}>
      <ul className={S.menu} data-open={open}>
        <li className={S.option}>
          <Link to="/" className={S.link} data-active={pathname === '/'}>
            {pathname === '/' ? <IconHomeFilled /> : <IconHome />}
            {open && <span>Homepage</span>}
          </Link>
        </li>
        <li className={S.option}>
          <Link to="/settings" className={S.link} data-active={pathname === '/settings'}>
            {pathname === '/settings' ? <IconSettingsFilled /> : <IconSettings />}
            {open && <span>Configurações</span>}
          </Link>
        </li>
      </ul>
      <button className={S.openMenuOnMobile} onClick={() => setOpen(!open)}>
        {open ? <IconX /> : <IconMenu />}
      </button>
    </nav >
  )
}