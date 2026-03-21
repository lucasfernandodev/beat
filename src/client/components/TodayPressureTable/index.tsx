import { useQuery } from '@tanstack/react-query';
import S from './style.module.css';
import type { FC } from 'react';
import type { ApiSession } from '../../types/api-session';
import { ClassifyTags } from '../ClassifyTags';
import { formatDateToBr } from '../../utils/format-date-to-br';
import { PeriodTags } from '../PeriodTags';

interface TodayPressureTableProps {
  username: string;
}
export const TodayPressureTable: FC<TodayPressureTableProps> = ({
  username
}) => {

  const { data, isLoading } = useQuery({
    queryKey: ['get-today-pressures', username],
    queryFn: async () => {
      const today = '2026-03-20'
      const response = await fetch(`/api/patients/${username}/pressures?date=${today}`)
      const data = await response.json()
      return data?.data as ApiSession[]
    }
  })

  if (isLoading) {
    return <span>loading</span>
  }

  const sortedData = (data || []).sort((a, b) => {
    return new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  })

  return (
    <section className={S.section}>
      <h3>
        <span>Medições de hoje</span>
      </h3>
      <table className={S.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>período</th>
            <th>Pressão</th>
            <th>Coração</th>
            <th>Classificação</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(values => {
            return (
              <tr>
                <td>{formatDateToBr(values.measuredAt)}</td>
                <td><PeriodTags period={values.period} /></td>
                <td>{values.pressures[0].pressure}</td>
                <td>{values.pressures[0].heartRate}</td>
                <td><ClassifyTags classify={values.pressures[0].classify} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {sortedData.length === 0 && <p className={S.empty_table_message}>Nenhuma medição feita hoje</p>}
    </section>
  )
}