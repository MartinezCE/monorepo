import { useRouter } from 'next/router';
import { useState } from 'react';

import styled from 'styled-components';
import { Button, DeleteBaseModal, EmptyState, LoadingSpinner } from '@wimet/apps-shared';
import Layout from '../../components/Layout';
import LayoutWrapper from '../../components/LayoutWrapper';
import { SurveyCard, SurveyCardFooter } from '../../components/SurveyPage';

import { copyLinkToClipboard, surveyDateToString } from '../../components/SurveyPage/helpers';
import useGetSurveys from '../../hooks/api/useGetCompanySurveys';
import useDeleteSurvey from '../../hooks/api/useDeleteCompanySurveys';
import useActivateSurvey from '../../hooks/api/useActivateSurvey';

const MainTitle = styled.p`
  font-size: 24px;
  font-weight: 700;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
`;

const SurveysPage = () => {
  const router = useRouter();

  const [removeSurveyId, setRemoveSurveyId] = useState<string>('');

  const { data: surveysList = [] } = useGetSurveys();
  const { mutateAsync: handleDeleteSurvey, status: deletingStatus } = useDeleteSurvey();
  const { mutateAsync: handleActivateNewSurvey, isLoading: activatingSurvey } = useActivateSurvey();

  const handleGoToSurvey = (surveyId: string) => router.push(`/surveys/${surveyId}`);

  return (
    <Layout title='Wimet | Members'>
      <LayoutWrapper>
        <Header>
          <MainTitle>Hybrid Strategy Survey</MainTitle>
          <Button onClick={() => handleActivateNewSurvey()} disabled={activatingSurvey}>
            {activatingSurvey && <LoadingSpinner />}
            {activatingSurvey ? 'Activando' : 'Activar'} nueva encuesta
          </Button>
        </Header>
        {surveysList.length > 0 ? (
          surveysList.map(survey => (
            <SurveyCard
              key={survey.formId}
              title={survey.formName}
              date={surveyDateToString(survey.createdAt)}
              link={survey.formLink}
              totalResponses={survey.totalResponses}>
              <SurveyCardFooter
                onCopyLink={() => copyLinkToClipboard(survey.formLink)}
                onSeeCharts={() => {
                  if (!survey.totalResponses) return;
                  handleGoToSurvey(survey.formId);
                }}
                onDelete={() => setRemoveSurveyId(survey.formId)}
                disableSeeCharts={!survey.totalResponses}
                disableDeleteIcon={removeSurveyId === survey.formId}
              />
            </SurveyCard>
          ))
        ) : (
          <EmptyState
            title='No tienes encuestas activas en este momento'
            subtitle='No pierdas tiempo, preguntale a tu equipo como se encuentra'
          />
        )}
      </LayoutWrapper>
      {(removeSurveyId || deletingStatus === 'loading') && (
        <DeleteBaseModal
          disableButton={deletingStatus === 'loading'}
          title='¿Eliminar encuesta?'
          onCancel={() => setRemoveSurveyId('')}
          onClose={() => setRemoveSurveyId('')}
          onConfirm={() => handleDeleteSurvey(removeSurveyId)}
        />
      )}
    </Layout>
  );
};

export default SurveysPage;
