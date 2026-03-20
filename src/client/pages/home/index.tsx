
import { useQuery } from '@tanstack/react-query';
import { CreatePatientForm } from '../../components/CreatePatientForm';
import { Layout } from '../../layout';
import S from './style.module.css';
import { Link } from '../../infra/link';

interface Response {
  success: boolean;
  data: {
    name: string;
    username: string
  }[]
}

export const PageHome = () => {

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch("/api/patients")
      const data = await response.json()
      return data as Response
    },
    queryKey: ['get-all-patients']
  })

  return (
    <Layout>
      <section className={S.section}>
        <CreatePatientForm />
        {!isLoading && data?.data?.map(patient => {
          return (
            <Link key={patient.username} to={`/pressure/${patient.name}`} className={S.card} role="button">
              <div className={S.icon}>{patient.name[0]}</div>
              <span>{patient.name}</span>
            </Link>
          )
        })}
      </section>
    </Layout>
  )
}