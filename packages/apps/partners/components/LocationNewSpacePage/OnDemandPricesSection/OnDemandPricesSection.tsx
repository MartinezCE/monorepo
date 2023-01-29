/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  images,
  InnerStepFormLayout,
  Input,
  Label,
  LoadingSpinner,
  useGetCredits,
  useGetMe,
} from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import styled, { css } from 'styled-components';
import useGetLocation from '../../../hooks/api/useGetLocation';
import useParsedSchedule from '../../../hooks/useParsedSchedule';
import { EditSpaceInitialValues } from '../../../pages/locations/[locationId]/spaces/[spaceId]/edit';
import { DaySelector } from '../../common';
import RowActionButtons from '../../common/RowActionButtons';
import useSchedule from '../SelectAvailabilitySection/useSchedule';

const StyledInnerStepFormLayout = styled(InnerStepFormLayout)`
  max-width: fit-content;
`;

const StyledRow = styled.div`
  margin-top: 46px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  column-gap: 10px;
`;

const StyledBadge = styled(Badge)`
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.colors.lightOrange};
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.fontWeight[2]};
  display: flex;
`;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, min-content);
  column-gap: 36px;
  row-gap: 40px;
`;

const StyledDaySelectorWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: auto;
`;

const HourPriceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr) min-content 1fr min-content 1fr;
  grid-template-rows: 1fr;
  column-gap: 16px;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledInput = styled(Input)`
  width: 80px;

  > div {
    height: 32px;

    input {
      padding: 6px 12px;
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      > div {
        border: 1px solid ${({ theme }) => theme.colors.gray};
      }
    `}
`;

const StyledSeparator = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.gray};
`;

const StyledLabel = styled(Label)`
  font-weight: ${({ theme }) => theme.fontWeight[0]};
`;

const StyledRowActionButtons = styled(RowActionButtons)`
  align-items: flex-start;
`;

type Props = {
  description: string;
};

export default function OnDemandPricesSection({ description }: Props) {
  const router = useRouter();
  const { setFieldValue, values } = useFormikContext<EditSpaceInitialValues>();
  const { handleOnChange } = useParsedSchedule();
  const { data: locationData } = useGetLocation(router.query.locationId as string);
  const { data: feePercentage = 0 } = useGetMe({
    staleTime: 0,
    select: user => Number(user.companies[0].feePercentage) || 0,
  });

  const { groups, handleChange, handleRemoveClick, handleAddClick, selectOptions, handleChangeSelect, selectValue } =
    useSchedule({
      fieldName: 'hourly',
      defaultValues: [{ price: 0, dayOfWeek: null, halfDayPrice: 0, fullDayPrice: 0, minHoursAmount: 0 }],
      onChange: handleOnChange,
    });

  const { data: creditsPrice = 0, isLoading } = useGetCredits(
    { currencyId: locationData?.currencyId },
    { select: data => Number(data[0].value) || 0 }
  );

  const getCreditsByPrice = (_price?: number) => {
    const price = Number(_price) || 0;
    if (isLoading) return 'Cargándo...';
    return `${Math.ceil((price + price * feePercentage) / creditsPrice)} créditos`;
  };

  return (
    <StyledInnerStepFormLayout label='Precio y Términos' description={description}>
      <StyledRow>
        <StyledBadge>{isLoading ? <LoadingSpinner /> : `$${creditsPrice} = 1 crédito`}</StyledBadge>
        <images.Question />
      </StyledRow>
      <StyledWrapper>
        {groups.map((line, i) => {
          const { daysOfWeek, indexs, ...meta } = line;

          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={i}>
              <StyledDaySelectorWrapper>
                <DaySelector
                  name='hourly'
                  options={selectOptions}
                  value={selectValue}
                  days={daysOfWeek}
                  selectOnChange={(e: any) => {
                    handleChangeSelect(e, meta);
                  }}
                  onChange={(isSelected, dayIndex) => {
                    handleChange(isSelected, dayIndex, meta, daysOfWeek);
                  }}
                />
              </StyledDaySelectorWrapper>
              <HourPriceWrapper>
                <StyledInputWrapper>
                  <StyledInput
                    label='Hora*'
                    placeholder='$0'
                    variant='withText'
                    onChange={e => {
                      indexs.forEach((day: number) => {
                        setFieldValue(`hourly[${day}].price`, e.target.value);
                      });
                    }}
                    name={`hourly[${indexs[0]}].price`}
                    moveSiblingOnError
                  />
                  <StyledLabel
                    text={getCreditsByPrice(values.hourly?.[indexs[0]]?.price)}
                    variant='tertiary'
                    lowercase
                  />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <StyledInput
                    label='Mínimo*'
                    placeholder='1h'
                    variant='withText'
                    onChange={e => {
                      indexs.forEach((day: number) => {
                        setFieldValue(`hourly[${day}].minHoursAmount`, e.target.value);
                      });
                    }}
                    name={`hourly[${indexs[0]}].minHoursAmount`}
                  />
                </StyledInputWrapper>

                <StyledSeparator />
                <StyledInputWrapper>
                  <StyledInput
                    label='Medio día'
                    placeholder='$0'
                    variant='withText'
                    onChange={e => {
                      indexs.forEach((day: number) => {
                        setFieldValue(`hourly[${day}].halfDayPrice`, e.target.value);
                      });
                    }}
                    name={`hourly[${indexs[0]}].halfDayPrice`}
                  />
                  <StyledLabel
                    text={getCreditsByPrice(values.hourly?.[indexs[0]]?.halfDayPrice)}
                    variant='tertiary'
                    lowercase
                  />
                </StyledInputWrapper>
                <StyledSeparator />
                <StyledInputWrapper>
                  <StyledInput
                    label='Daypass'
                    placeholder='$2000'
                    variant='withText'
                    onChange={e => {
                      indexs.forEach((day: number) => {
                        setFieldValue(`hourly[${day}].fullDayPrice`, e.target.value);
                      });
                    }}
                    name={`hourly[${indexs[0]}].fullDayPrice`}
                  />
                  <StyledLabel
                    text={getCreditsByPrice(values.hourly?.[indexs[0]]?.fullDayPrice)}
                    variant='tertiary'
                    lowercase
                  />
                </StyledInputWrapper>
              </HourPriceWrapper>
              <StyledRowActionButtons
                showAdd={groups.length - 1 === i}
                onDuplicate={() => {
                  handleAddClick(meta);
                }}
                onDelete={() => handleRemoveClick(daysOfWeek)}
                onAdd={
                  () =>
                    handleAddClick({ price: 0, dayOfWeek: null, halfDayPrice: 0, fullDayPrice: 0, minHoursAmount: 0 })
                  // @ts-ignore
                }
              />
            </Fragment>
          );
        })}
      </StyledWrapper>
    </StyledInnerStepFormLayout>
  );
}
