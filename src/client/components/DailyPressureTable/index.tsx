import { useQuery } from '@tanstack/react-query';
import S from './style.module.css';
import { useState, type FC } from 'react';
import type { ApiSession } from '../../types/api-session';
import { ClassifyTags } from '../ClassifyTags';
import { formatDateToBr } from '../../utils/format-date-to-br';
import { PeriodTags } from '../PeriodTags';
import { classifyPressureEn } from '../../utils/classify-pressure-en';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { getSmartLabel } from '../../utils/get-smart-label';

interface DailyPressureTableProps {
  username: string;
}
export const DailyPressureTable: FC<DailyPressureTableProps> = ({
  username
}) => {

  const [daily, setDaily] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
  })

  const { data, isLoading } = useQuery({
    queryKey: ['get-daily-pressures', username, daily],
    queryFn: async () => {
      const formatted = daily.toISOString().split('T')[0];
      const response = await fetch(`/api/patients/${username}/pressures?date=${formatted}`)
      const data = await response.json()
      return data?.data as ApiSession[]
    },
    enabled: !!daily
  })

  if (isLoading) {
    return <span>loading</span>
  }

  const sortedData = (data || []).sort((a, b) => {
    return new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  })

  const back = () => {
    setDaily(prev => {
      const date = new Date(prev);
      date.setDate(date.getDate() - 1);
      return date;
    });
  };

  const next = () => {
    setDaily(prev => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextDate = new Date(prev);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);

      if (nextDate > today) return prev; // bloqueia

      return nextDate;
    });
  };

  return (
    <section className={S.section}>
      <h3>
        <span>Medições de {getSmartLabel(daily)}</span>
        <div className={S.controllers}>
          <button onClick={back}><IconChevronLeft /></button>
          <button onClick={next}><IconChevronRight /></button>
        </div>
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
              <tr key={values.id}>
                <td>{formatDateToBr(values.measuredAt)}</td>
                <td><PeriodTags period={values.period} /></td>
                <td>{values.pressures[0].pressure}</td>
                <td>{values.pressures[0].heartRate}</td>
                <td><ClassifyTags classify={classifyPressureEn(
                  values.pressures[0].systolic,
                  values.pressures[0].diastolic
                )} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {sortedData.length === 0 && <p className={S.empty_table_message}>
        Nenhuma medição feita {getSmartLabel(daily)}
      </p>}
    </section>
  )
}