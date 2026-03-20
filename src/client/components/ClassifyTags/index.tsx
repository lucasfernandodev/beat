import S from './style.module.css';
import type { PressureCategory } from '../../types/api-session';
import type { FC } from 'react';
import { pressureCategoryToPtBr } from '../../utils/pressure-category-to-ptbr';

interface ClassifyTagsProps {
  classify: PressureCategory;
}

export const ClassifyTags: FC<ClassifyTagsProps> = ({ classify }) => {
  const colorMap = {
    low: "#60A5FA",
    normal: "#9ae8ce",
    elevated: "#ecd7b2",
    hypertension_stage_1: "#a87a2a",
    hypertension_stage_2: "#eb9e9e",
    hypertensive_crisis: "#4a3c68",
  }
  return (
    <span
      style={{ background: colorMap[classify] }}
      className={S.classifyTag}
      title="Classificação da ultima medição"
    >
      {pressureCategoryToPtBr(classify)}
    </span>
  )
}