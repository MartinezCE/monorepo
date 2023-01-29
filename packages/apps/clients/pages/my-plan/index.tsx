import styled from 'styled-components';
import { images, DonutChart, theme, planStatusLabels, PlanStatus, LoadingSpinner, useGetMe } from '@wimet/apps-shared';
import { formatInTimeZone } from 'date-fns-tz';
import { GetServerSidePropsContext } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { AxiosRequestHeaders } from 'axios';
import Layout from '../../components/Layout';
import useGetUserPlan, { getUserPlan, GET_USER_PLAN } from '../../hooks/api/useGetUserPlan';
import useGetPlanUsers, { getPlanUsers, GET_PLAN_USERS } from '../../hooks/api/useGetPlanUsers';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 72px 75px;
  gap: 50px;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    :first-of-type {
      padding-bottom: 90px;
      border-bottom: 0.1em solid ${({ theme: { colors } }) => colors.lightGray};
    }
    :last-child {
      > div:first-child {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: ${({ theme: { colors } }) => colors.blue};
        > p {
          font-size: 14px;
        }
        > button {
          margin-top: 20px;
        }
      }
      > div:last-child > p > span {
        color: ${({ theme: { colors } }) => colors.blue};
        font-weight: bold;
      }
    }
  }
`;

const StyledTopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    :first-child {
      gap: 32px;
      > h5 {
        font-size: 40px;
        font-weight: bold;
      }
      > span {
        background-color: ${({ theme: { colors } }) => colors.orange};
        border-radius: 4px;
        padding: 6px 8px;
        font-size: 12px;
        color: ${({ theme: { colors } }) => colors.white};
      }
    }
    :last-child {
      gap: 8px;
      color: ${({ theme: { colors } }) => colors.blue};
      > span {
        font-size: 14px;
        font-weight: bold;
        color: ${({ theme: { colors } }) => colors.blue};
      }
    }
  }
`;

const StyledTopRight = styled.div`
  display: flex;
  gap: 60px;
  > div:last-child {
    display: flex;
    flex-direction: column;
    > div {
      text-align: right;
      > h5,
      span {
        color: ${({ theme: { colors } }) => colors.blue};
      }
      > h5 > strong {
        font-weight: bold;
      }
      :last-child {
        h5 > {
          font-weight: bold;
        }
      }
    }
  }
`;

const labels = ['disponibles', 'utilizados por compañeros', 'utilizados por ti'];
const colors = [theme.colors.darkBlue, theme.colors.blue, theme.colors.lightBlue];

export default function MyPlan() {
  const { data: userData } = useGetMe();
  const { data: planData } = useGetUserPlan();
  const { data: collaborators } = useGetPlanUsers(Number(planData?.id), { enabled: !!planData?.id });
  const series = planData
    ? [
        planData.maxPersonalCredits - Number(planData?.usedCredits),
        Number(planData.usedCredits),
        Number(planData.userUsedCredits),
      ]
    : [];

  return (
    <Layout>
      <StyledWrapper>
        <h6>Mi plan</h6>
        <div>
          <StyledTopLeft>
            <div>
              <h5>{planData?.name}</h5>
              <span>{planStatusLabels[planData?.status || PlanStatus.ACTIVE]}</span>
            </div>
            <div>
              <images.TinyStaff />
              {collaborators ? <span>{collaborators.length} colaboradores</span> : <LoadingSpinner />}
            </div>
          </StyledTopLeft>
          <StyledTopRight>
            <DonutChart title='Créditos' series={series} labels={labels} colors={colors} />
            <div>
              <div>
                <h5>
                  <strong>{planData?.usedCredits}</strong>/{planData?.maxPersonalCredits}
                </h5>
                <span>créditos utilizados en total</span>
              </div>
              <div>
                <h5>{planData?.userUsedCredits}</h5>
                <span>utilizados por ti</span>
              </div>
            </div>
          </StyledTopRight>
        </div>
        <div>
          <div>
            <images.Info />
            <p>
              Válido hasta el{' '}
              <strong>
                {planData?.planRenovations?.[0] &&
                  userData?.companies[0] &&
                  formatInTimeZone(planData.planRenovations[0].endDate, userData.companies[0].tz, 'dd/MM/yyyy')}
              </strong>
            </p>
          </div>
          <div>
            <p>
              ¿Tienes preguntas? <span>Escríbenos</span>
            </p>
          </div>
        </div>
      </StyledWrapper>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const headers = context.req.headers as AxiosRequestHeaders;

  const plan = await queryClient.fetchQuery(GET_USER_PLAN, () => getUserPlan(headers));
  await queryClient.prefetchQuery([GET_PLAN_USERS, plan.id], () => getPlanUsers(plan.id, headers));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
