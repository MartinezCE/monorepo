import { useRouter } from 'next/router';
import { HeaderHero } from '@wimet/apps-shared';
import styled from 'styled-components';
import { Layout, LayoutWrapper } from '../../components';
import banner from '../../public/images/image_locations.png';

const StepsBoxs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0px 20px 50px rgb(44 48 56 / 12%);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    min-height: 166px;
    strong {
      margin-bottom: 1rem;
    }
  }
  div:nth-child(2) {
    margin: 0 4rem;
  }
`;

export default function TeamsPage() {
  const router = useRouter();

  const title = (
    <>
      Gestiona tus equipos como <br /> nunca antes
    </>
  );

  const description = (
    <>
      Centraliza todos los permisos, accesos y límites de <br /> presupuesto de tus colaboradores en un solo lugar.
    </>
  );

  return (
    <Layout>
      <LayoutWrapper>
        <HeaderHero
          title={title}
          description={description}
          banner={banner}
          handleClick={() => {
            router.push({
              pathname: '/teams/list',
            });
          }}
        />
        <StepsBoxs>
          <div>
            <strong>Grupos y equipos</strong>
            <span>
              Agrupa colaboradores en función de su equipos, tareas, ubicaciones y adminístrelos de manera centralizada
              y simple.
            </span>
          </div>
          <div>
            <strong>Reglas de uso</strong>
            <span>
              Otorga diferentes roles y permisos a cada grupo o equipo de colaboradores en función de sus necesidades.
            </span>
          </div>
          <div>
            <strong>Límites de presupuesto</strong>
            <span>
              Establezca límites mensuales para que los miembros del equipo puedan reserven oficinas y salas de manera
              independiente.
            </span>
          </div>
        </StepsBoxs>
      </LayoutWrapper>
    </Layout>
  );
}
