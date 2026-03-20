import { useParams } from "react-router";
import { Layout } from "../../layout";

export const PatientPressureOverview = () => {
  const { username } = useParams();

  return (
    <Layout>
      <h1>Usuário: {username}</h1>
    </Layout>
  );
}