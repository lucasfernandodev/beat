import S from './style.module.css'
import { IconCloudCheck } from '@tabler/icons-react';

export const SyncStatus = () => {
  return (
    <button className={S.button} title='Sincronizado com a nuvem'>
      <IconCloudCheck />
    </button>
  )
}