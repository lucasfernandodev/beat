import { useQuery } from '@tanstack/react-query';
import S from './style.module.css'
import { IconCloud, IconCloudCheck } from '@tabler/icons-react';
import { useParams } from 'react-router';

export const SyncStatus = () => {

  const { username } = useParams();

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(`/api/patients/${username}/pressures/pending/count`)
      const data = response.json()
      return data
    },
    queryKey: ['count-pending-pressure', username],
    enabled: !!username
  })



  if (isLoading) {
    return (
      <button className={S.button} >
        loading
      </button>
    )
  }

  if (!username) {
    return (
      <button className={S.button} >
        <IconCloud />
      </button>
    )
  }

  if (data?.data === 0) {
    return (
      <button className={S.button} title='Sincronizado com a nuvem'>
        <IconCloudCheck />
      </button>
    )
  }

  if (data?.data > 0) {
    return (
      <button className={S.button} title={`Faltam ${data?.data} records para sincronizar com o notion`}>
        <IconCloud />
        <span>{data?.data}</span>
      </button>
    )
  }
}