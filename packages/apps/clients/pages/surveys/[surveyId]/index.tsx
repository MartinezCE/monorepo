/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import { RefObject, useEffect, useRef, useState } from 'react';

import styled, { css } from 'styled-components';
import { images } from '@wimet/apps-shared';
import { IconButton } from '../../../components/SurveyPage';
import GoBackTitle from '../../../components/GoBackTitle';
import Layout from '../../../components/Layout';
import LayoutWrapper from '../../../components/LayoutWrapper';
import useGetSurveySummary from '../../../hooks/api/useGetSurveySummary';
import { PercentageCard, SummaryGrid, TextInfoCard } from '../../../components/SurveyPage/SummarySection';
import ToggleSection from '../../../components/SurveyPage/ToggleSection';
import QuestionSectionDetail from '../../../components/SurveyPage/QuestionSectionDetail';
import { ToggleWrapper } from '../../../components/SurveyPage/ToggleSection/ToggleSection.styles';
import useGetSurveyData from '../../../hooks/api/useGetSurveyData';
import useUpdateSurveyDetails from '../../../hooks/api/useUpdateSurveyDetails';

const Header = styled.div`
  display: flex;
  column-gap: 22px;
`;

const EditButton = styled(IconButton)`
  transform: scale(0.9);
`;

const MainTitle = styled.div`
  p,
  span {
    font-size: 46px;
  }

  .main-title {
    font-weight: 300;
    line-height: 56px;
  }

  .main-title--bold {
    font-weight: 800;
  }
`;

const StyledInput = styled.input<{ isEditing: boolean }>`
  all: inherit;
  cursor: pointer;
  caret-color: transparent;

  ${({ isEditing }) =>
    isEditing &&
    css`
      color: ${({ theme }) => theme.colors.blue};
      cursor: initial;
      caret-color: ${({ theme }) => theme.colors.darkBlue};
    `}
`;

enum SurveySections {
  CHOICE_WORKPLACE = 'CHOICE_WORKPLACE',
  EMPLOYEES_PREFERENCES = 'EMPLOYEES_PREFERENCES',
  REMOTE_WORK = 'REMOTE_WORK',
  THIRD_SPACES = 'THIRD_SPACES',
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SurveyChartPage = () => {
  const router = useRouter();
  const { surveyId } = router.query;

  const { data: survey } = useGetSurveyData(surveyId as string);
  const { mutateAsync: updateSurvey } = useUpdateSurveyDetails(surveyId as string);

  const workplaceSectionRef = useRef<HTMLDivElement>(null);
  const employeesSectionRef = useRef<HTMLDivElement>(null);
  const remoteWorkSectionRef = useRef<HTMLDivElement>(null);
  const thirdPlacesSectionRef = useRef<HTMLDivElement>(null);

  const [titleRef, setTitleRef] = useState<HTMLInputElement | null>();

  const [expandedSection, setExpandedSection] = useState<SurveySections | null>();
  const [editingName, setEditingName] = useState<boolean>(false);
  const [surveyName, setSurveyName] = useState<string>(survey?.name);
  const [titleWidth, setTitleWidth] = useState<number>();

  const { data: generalPeek } = useGetSurveySummary(surveyId as string, 'general-peek');
  const { data: choiceOfWorkplace } = useGetSurveySummary(surveyId as string, 'choice-of-workplace', {
    enabled: expandedSection === SurveySections.CHOICE_WORKPLACE,
  });
  const { data: employeesPreferences } = useGetSurveySummary(surveyId as string, 'employees-preferences', {
    enabled: expandedSection === SurveySections.EMPLOYEES_PREFERENCES,
  });
  const { data: remoteWork } = useGetSurveySummary(surveyId as string, 'remote-work', {
    enabled: expandedSection === SurveySections.REMOTE_WORK,
  });
  const { data: thirdSpaces } = useGetSurveySummary(surveyId as string, 'third-spaces', {
    enabled: expandedSection === SurveySections.THIRD_SPACES,
  });

  const handleOnGoBack = () => router.back();

  const scrollTo = (top: number) =>
    window.scrollTo({
      top,
      behavior: 'smooth',
    });

  const onToggleSection = async (section: SurveySections, ref?: RefObject<HTMLDivElement>) => {
    setExpandedSection(prev => {
      if (section === prev) return null;
      return section;
    });

    await sleep(150);
    scrollTo((ref?.current?.offsetTop || 100) - 100);
  };

  const handleGoToSection = async (section: SurveySections, ref: RefObject<HTMLDivElement>) => {
    if (section !== expandedSection) {
      await onToggleSection(section);
    }
    scrollTo((ref?.current?.offsetTop || 100) - 100);
  };

  const onTitleChange = () => {
    if (surveyName !== survey?.name) updateSurvey({ formName: surveyName });
    setEditingName(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (e.target.type !== 'input') {
        setEditingName(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [titleRef]);

  return (
    <Layout title='Wimet | Members'>
      <LayoutWrapper>
        <Header>
          <GoBackTitle
            onClick={!editingName ? handleOnGoBack : () => {}}
            title={
              <StyledInput
                isEditing={editingName}
                onClick={e => {
                  e.stopPropagation();
                  setEditingName(true);
                }}
                ref={ref => {
                  if (!ref) return;
                  setTitleWidth(ref?.scrollWidth);
                  setTitleRef(ref);
                }}
                type='text'
                style={{ width: `${titleWidth}px` }}
                defaultValue={survey?.name}
                onChange={({ currentTarget }) => setSurveyName(currentTarget.value)}
                onBlur={onTitleChange}
                onKeyDown={e => {
                  if (e.code === 'Enter') {
                    onTitleChange();
                  }
                }}
              />
            }
          />
          <EditButton
            disabled={editingName}
            variant='secondary'
            leadingIcon={<images.TinyEdit />}
            onClick={() => {
              setEditingName(true);
            }}
          />
        </Header>
        <MainTitle>
          <p className='main-title'>
            Un <span className='main-title--bold'>modelo híbrido,</span>
          </p>
          <p className='main-title'>la solución ideal para {survey?.companyName}</p>
        </MainTitle>
        {generalPeek && (
          <SummaryGrid>
            <PercentageCard
              progress={generalPeek.percentage.companyShouldHaveOffice}
              showCircle
              onClickButton={() => handleGoToSection(SurveySections.EMPLOYEES_PREFERENCES, employeesSectionRef)}
              text={
                <>
                  de tu equipo todavia <strong>quiere una oficina</strong>
                </>
              }
            />
            <PercentageCard
              progress={generalPeek.percentage.daysPerWeekWorkFromHome}
              $isColumn
              onClickButton={() => handleGoToSection(SurveySections.CHOICE_WORKPLACE, workplaceSectionRef)}
              text={
                <>
                  quisiera trabajar al menos <strong>1 vez por semana desde su casa</strong>
                </>
              }
            />
            <PercentageCard
              $isColumn
              onClickButton={() => handleGoToSection(SurveySections.EMPLOYEES_PREFERENCES, employeesSectionRef)}
              progress={generalPeek.percentage.companyHasPartimeOffice}
              text='le gustaria que su empresa tuviera una oficina part time.'
            />
            <PercentageCard
              $isColumn
              progress={generalPeek.percentage.workFromAnywhereIfCompanyPays}
              text='quisiera poder trabajar en espacios de coworking.'
              onClickButton={() => handleGoToSection(SurveySections.CHOICE_WORKPLACE, workplaceSectionRef)}
            />
            <TextInfoCard
              iconName='star'
              onClickButton={() => handleGoToSection(SurveySections.REMOTE_WORK, remoteWorkSectionRef)}
              text={
                <>
                  <strong>{generalPeek.info?.workingFromHome?.answer}</strong> es lo que más les gusta de trabajar en
                  casa
                </>
              }
            />
            <TextInfoCard
              iconName='location'
              onClickButton={() => handleGoToSection(SurveySections.THIRD_SPACES, thirdPlacesSectionRef)}
              text={
                <>
                  <strong>{generalPeek.info?.coworkLocation?.answer}</strong> es la ubicación top elegida para espacios
                  de cowork.
                </>
              }
            />
            <TextInfoCard
              iconName='star'
              onClickButton={() => handleGoToSection(SurveySections.EMPLOYEES_PREFERENCES, employeesSectionRef)}
              text={
                <>
                  <strong>{generalPeek.info?.itemsInOffice?.answer}</strong> es el amenity mas deseado en una oficina.
                </>
              }
            />
            <TextInfoCard
              $isColumn
              iconName='building'
              onClickButton={() => handleGoToSection(SurveySections.EMPLOYEES_PREFERENCES, employeesSectionRef)}
              text={
                <>
                  <strong>{generalPeek.info?.whyLikeOffice?.answer}</strong> es la principal razón por la que tu equipo
                  quiere una oficina.
                </>
              }
            />
          </SummaryGrid>
        )}

        <ToggleWrapper>
          <div ref={workplaceSectionRef}>
            <ToggleSection
              isExpanded={expandedSection === SurveySections.CHOICE_WORKPLACE}
              onClick={() => onToggleSection(SurveySections.CHOICE_WORKPLACE, workplaceSectionRef)}
              title='¿Donde quieren trabajar tus colaboradores?'>
              {choiceOfWorkplace && <QuestionSectionDetail data={choiceOfWorkplace} />}
            </ToggleSection>
          </div>

          <div ref={employeesSectionRef}>
            <ToggleSection
              isExpanded={expandedSection === SurveySections.EMPLOYEES_PREFERENCES}
              onClick={() => onToggleSection(SurveySections.EMPLOYEES_PREFERENCES, employeesSectionRef)}
              title='Análisis en profundidad: cómo les gusta trabajar a sus empleados. La oficina de la empresa'>
              {employeesPreferences && <QuestionSectionDetail data={employeesPreferences} />}
            </ToggleSection>
          </div>

          <div ref={remoteWorkSectionRef}>
            <ToggleSection
              isExpanded={expandedSection === SurveySections.REMOTE_WORK}
              onClick={() => onToggleSection(SurveySections.REMOTE_WORK, remoteWorkSectionRef)}
              title='Trabajo remoto'>
              {remoteWork && <QuestionSectionDetail data={remoteWork} />}
            </ToggleSection>
          </div>

          <div ref={thirdPlacesSectionRef}>
            <ToggleSection
              isExpanded={expandedSection === SurveySections.THIRD_SPACES}
              onClick={() => onToggleSection(SurveySections.THIRD_SPACES, thirdPlacesSectionRef)}
              title='Terceros espacios'>
              {thirdSpaces && <QuestionSectionDetail data={thirdSpaces} />}
            </ToggleSection>
          </div>
        </ToggleWrapper>
      </LayoutWrapper>
    </Layout>
  );
};

export default SurveyChartPage;
