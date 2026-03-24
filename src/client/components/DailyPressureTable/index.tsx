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
import { Table } from '../table';
import { getAverage } from '../../utils/get-average';
import { getAveragePressure } from '../../utils/get-average-pressure';

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
      <Table.Root className={S.table}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Data</Table.HeaderCell>
            <Table.HeaderCell>período</Table.HeaderCell>
            <Table.HeaderCell>Pressão</Table.HeaderCell>
            <Table.HeaderCell data-header-type="heart">Coração</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedData.map(values => {

            const avgSystolic = getAverage(values.pressures, p => p.systolic);

            const avgDystolic = getAverage(values.pressures, p => p.diastolic);

            const mHeart = getAverage(values.pressures, p => p.heartRate);

            const pressure = getAveragePressure(values.pressures, p => ({
              systolic: p.systolic,
              diastolic: p.diastolic,
            }));

            const data = formatDateToBr(values.measuredAt)

            return (
              <Table.Row key={values.id}>
                <Table.Cell data-type="date">
                  {data.split(" ").map((v, i) => (
                    <span key={i}>{v}</span>
                  ))}
                </Table.Cell>
                <Table.Cell><PeriodTags period={values.period} /></Table.Cell>
                <Table.Cell>{pressure}</Table.Cell>
                <Table.Cell data-body-type="heart">{mHeart}</Table.Cell>
                <Table.Cell><ClassifyTags classify={classifyPressureEn(
                  avgSystolic,
                  avgDystolic
                )} /></Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
      {sortedData.length === 0 && <p className={S.empty_table_message}>
        Nenhuma medição feita {getSmartLabel(daily)}
      </p>}
    </section>
  )
}