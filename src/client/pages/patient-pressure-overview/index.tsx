import S from './style.module.css';
import { Navigate, useParams } from "react-router";
import { Layout } from "../../layout";
import { useQuery } from "@tanstack/react-query";
import { CreatePressureForm } from '../../components/CreatePressureForm';
import type { ApiSession, PressureCategory } from '../../types/api-session';
import { ClassifyTags } from '../../components/ClassifyTags';
import { TodayPressureTable } from '../../components/TodayPressureTable';
import { classifyPressureEn } from '../../utils/classify-pressure-en';
import { DailyPressureTable } from '../../components/DailyPressureTable';

interface Response {
  success: boolean;
  data: {
    username: string;
    name: string,
    sessions: ApiSession[]
  }
}
export const PatientPressureOverview = () => {
  const { username } = useParams();

  const { isLoading, data } = useQuery({
    queryFn: async () => {
      const response = await fetch(`/api/patients/${username}`)
      const data = await response.json() as Response;
      return data;
    },
    queryKey: ['get-patient-by-username', username],
    enabled: !!username
  })

  if (isLoading) {
    return (
      <Layout>
        Loading...
      </Layout>
    )
  }

  if (!isLoading && data?.data === null) {
    return <Navigate to="/404" replace />
  }

  const classify = ((data?.data?.sessions || []).length > 0 ? classifyPressureEn(
    data?.data?.sessions[0]?.pressures[0]?.systolic || 0,
    data?.data?.sessions[0]?.pressures[0]?.diastolic || 0
  ) : null) as PressureCategory | null

  return (
    <Layout>
      <header className={S.header}>
        <div className={S.profile}>
          <div className={S.icon}>
            {data?.data?.name[0]}
          </div>
          <h3>{data?.data?.name}</h3>
          {classify && <span>-</span>}
          {classify && <ClassifyTags classify={classify} />}
        </div>
        {data?.data?.username && <CreatePressureForm username={data?.data?.username} />}
      </header>
      {data?.data?.username && <TodayPressureTable username={data?.data?.username} />}
      {data?.data?.username && <DailyPressureTable username={data?.data?.username} />}
    </Layout>
  );
}