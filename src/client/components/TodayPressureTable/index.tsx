import { useQuery } from '@tanstack/react-query';
import S from './style.module.css';
import type { FC } from 'react';
import type { ApiSession } from '../../types/api-session';
import { ClassifyTags } from '../ClassifyTags';
import { formatDateToBr } from '../../utils/format-date-to-br';
import { PeriodTags } from '../PeriodTags';
import { classifyPressureEn } from '../../utils/classify-pressure-en';
import { Table } from '../table';
import { getAverage } from '../../utils/get-average';
import { getAveragePressure } from '../../utils/get-average-pressure';

interface TodayPressureTableProps {
  username: string;
}
export const TodayPressureTable: FC<TodayPressureTableProps> = ({
  username
}) => {

  const { data, isLoading } = useQuery({
    queryKey: ['get-today-pressures', username],
    queryFn: async () => {
      const today = new Date();
      const formatted = today.toISOString().split('T')[0];
      const response = await fetch(`/api/patients/${username}/pressures?date=${formatted}`)
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
              <Table.Row>
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
      {sortedData.length === 0 && <p className={S.empty_table_message}>Nenhuma medição feita hoje</p>}
    </section>
  )
}