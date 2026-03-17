import { Navigation } from '../components/navigation';
import { SyncStatus } from '../components/sync-status';
import { Link } from '../infra/link';
import S from './style.module.css';
import type React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={['#app', S.app].join(" ")}>
      <header className={S.header}>
        <Link to="/"><img src="/images/logo.svg" alt="Beat Logo" /></Link>
        <Navigation />
        <SyncStatus />
      </header>
      <main className={S.main}>
        {children}
      </main>
    </div >
  )
}