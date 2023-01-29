import { Badge, Button, Input, Label, LoadingSpinner } from '@wimet/apps-shared';
import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import styled from 'styled-components';
import TeamPageLayout from '../../../../components/TeamsPage/TeamPageLayout';
import useGetCompanyTeam from '../../../../hooks/api/useGetCompanyTeam';
import useUpdateCompanyTeam from '../../../../hooks/api/useUpdateCompanyTeam';

const toFixedWithoutZeros = (num: number | string, precision: number) =>
  Number(Number(num).toFixed(precision).replace(/\.0+$/, ''));

const Header = styled.div`
  .license-title {
    font-size: 1.2em;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.extraDarkBlue};
    margin-bottom: 0.4em;
  }

  .license-subtitle {
    font-size: 1em;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 30px;
  width: 75%;
`;

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 22px;
  align-items: center;
  justify-content: space-between;
`;

const StyledCurrency = styled.div`
  &::after {
    content: '$';
    color: ${({ theme }) => theme.colors.gray};
    font-family: monospace;
    font-size: 1.5em;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 12px;

  .badge {
    padding: 8px;
    background-color: ${({ theme }) => theme.colors.lightOrange};
    color: ${({ theme }) => theme.colors.darkGray};
    font-weight: 400;
    font-size: 0.8em;
  }

  .badge-error {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const StyleLabel = styled(Label)`
  width: 16rem;
`;

const TeamLicensesPage = () => {
  const router = useRouter();

  const { data: team = {} } = useGetCompanyTeam(router.query.teamId as string);
  const { mutateAsync: updateTeam, isLoading: updating } = useUpdateCompanyTeam(router.query.teamId as string);

  // @TODO -> asegurarse que todos los paises tegan asociada una moneda en la tabla
  const [planCredits, creditUnitValue] = useMemo(() => {
    const credits = team?.planCredit?.value || 0;
    const creditValue = team?.country?.currency?.credit?.value || 50;
    return [toFixedWithoutZeros(credits, 2), toFixedWithoutZeros(creditValue, 0)];
  }, [team]);

  const initialValues = useMemo(
    () => ({
      maxPersonalCredits: team.maxPersonalCredits * creditUnitValue || null,
      maxReservationCredits: team.maxReservationCredits * creditUnitValue || null,
    }),
    [team, creditUnitValue]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async values => {
      const maxPersonalCredits = Number(values.maxPersonalCredits) / creditUnitValue;
      const maxReservationCredits = Number(values.maxReservationCredits) / creditUnitValue;
      await updateTeam({ maxPersonalCredits, maxReservationCredits });
    },
  });

  const moneyToCredits = (num: string | number) => Number(toFixedWithoutZeros(num, 0) / creditUnitValue).toFixed(0);

  const disableUpdate =
    (!formik.values.maxPersonalCredits && !formik.values.maxReservationCredits) ||
    (formik.values.maxPersonalCredits === initialValues.maxPersonalCredits &&
      formik.values.maxReservationCredits === initialValues.maxReservationCredits) ||
    updating;

  return (
    <>
      <Header>
        <p className='license-title'>Presupuesto</p>
        <p className='license-subtitle'>Establece límites según preferencias para este grupo.</p>
      </Header>

      <BadgeContainer>
        <Badge className='badge'>{`$${creditUnitValue} = 1 crédito`}</Badge>
        <Badge className='badge'>{`Créditos asignados al plan: ${planCredits}`}</Badge>
      </BadgeContainer>

      <FormikProvider value={formik}>
        <StyledForm>
          <InputWrapper>
            <StyleLabel text='Colaborador - Límite Total (por mes)' lowercase variant='currentColor' size='large' />
            <Input
              type='number'
              placeholder='Presupuesto límite'
              name='maxPersonalCredits'
              leadingAdornment={<StyledCurrency />}
            />
            {formik.values.maxPersonalCredits && (
              <Label
                text={`Equivale a ${moneyToCredits(formik.values.maxPersonalCredits)} créditos`}
                lowercase
                variant='tertiary'
                size='small'
              />
            )}
          </InputWrapper>
          <InputWrapper>
            <StyleLabel text='Colaborador - Límite Total (por día)' lowercase variant='currentColor' size='large' />
            <Input
              type='number'
              placeholder='Presupuesto límite'
              name='maxReservationCredits'
              leadingAdornment={<StyledCurrency />}
            />
            {formik.values.maxReservationCredits && (
              <Label
                text={`Equivale a ${moneyToCredits(formik.values.maxReservationCredits)} créditos`}
                lowercase
                variant='tertiary'
                size='small'
              />
            )}
          </InputWrapper>
          <Button type='submit' disabled={disableUpdate}>
            {updating && <LoadingSpinner />}
            Confirmar
          </Button>
        </StyledForm>
      </FormikProvider>
    </>
  );
};

TeamLicensesPage.getLayout = (page: React.ReactElement) => <TeamPageLayout>{page}</TeamPageLayout>;

export default TeamLicensesPage;
