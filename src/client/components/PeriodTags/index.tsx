import S from './style.module.css';
import type { DayPeriod } from '../../types/api-session';
import type { FC } from 'react';
import { dayPeriodToPtBr } from '../../utils/day-period-to-ptbr';

interface PeriodTagsProps {
  period: DayPeriod;
}

export const PeriodTags: FC<PeriodTagsProps> = ({ period }) => {
  const colorMap = {
    early_morning: "#4a3c68",
    morning: "#ecd7b2",
    afternoon: "#a87a2a",
    evening: "#60A5FA",
  }

  return (
    <span
      style={{ background: colorMap[period] }}
      className={S.classifyTag}
      title="Classificação da ultima medição"
    >
      {dayPeriodToPtBr(period)}
    </span>
  )
}