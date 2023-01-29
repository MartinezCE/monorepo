import { calculateDiscount, Collapsible, Input, Label, pluralize, RadioButton, Switch } from '@wimet/apps-shared';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import useGetSpaceDeposits from '../../../../hooks/api/useGetSpaceDeposits';
import useGetSpaceDiscounts from '../../../../hooks/api/useGetSpaceDiscounts';
import LabeledCheckbox from '../../../UI/LabeledCheckbox';
import type { EditSpaceInitialValues } from '../../../../pages/locations/[locationId]/spaces/[spaceId]/edit';

const StyledRightSide = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 48px;
  padding-top: 22px;
`;

const StyledInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledAllCheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-top: 24px;
`;

const StyledCheckboxWrapper = styled.div`
  height: 30px;
  display: grid;
  grid-template-columns: 1fr 58px 1.5fr;
  column-gap: 12px;
  align-items: center;
`;

const StyledInput = styled(Input)`
  input {
    padding: 6px 12px;
  }

  span {
    white-space: nowrap;
  }
`;

const StyledAllRadioButtonsWrapper = styled.div`
  display: flex;
  column-gap: 24px;
  padding-top: 24px;
`;

export default function RightSideSwitches() {
  const formik = useFormikContext<EditSpaceInitialValues>();
  const { data: spaceDiscounts = [] } = useGetSpaceDiscounts({
    select: _data => _data.map(discount => ({ ...discount, label: pluralize(discount.months_amount, 'mes', true) })),
  });
  const { data: spaceDeposits = [] } = useGetSpaceDeposits({
    select: _data => _data.map(deposit => ({ ...deposit, label: pluralize(deposit.months_amount, 'mes', true) })),
  });

  const handleDiscountSwitch = () =>
    formik.setFieldValue('monthly.spaceDiscounts', formik.values.monthly.spaceDiscounts !== null ? null : []);

  const handleDiscountCheckbox = (item: typeof spaceDiscounts[number], itemIsInArray: boolean) => {
    if (!itemIsInArray) {
      return formik.setFieldValue('monthly.spaceDiscounts', [
        ...(formik.values.monthly.spaceDiscounts || []),
        { spaceDiscountId: item.id, percentage: '' },
      ]);
    }

    return formik.setFieldValue(
      'monthly.spaceDiscounts',
      formik.values.monthly.spaceDiscounts?.filter(_item => _item.spaceDiscountId !== item.id) || []
    );
  };

  const handleDepositSwitch = () =>
    formik.setFieldValue('monthly.spaceDepositId', formik.values.monthly.spaceDepositId !== null ? null : 1);

  const handleDepositRadioButton = (item: typeof spaceDeposits[number]) =>
    formik.setFieldValue('monthly.spaceDepositId', item.id);

  const handleCalculateDiscount = (discount: typeof spaceDiscounts[number], percentageIndex: number) =>
    calculateDiscount(
      Number(formik.values.monthly.price),
      discount.months_amount,
      (formik.values.monthly.spaceDiscounts?.[percentageIndex].percentage ?? 0) / 100
    );

  return (
    <StyledRightSide>
      <StyledInnerWrapper>
        <Switch
          label='Quiero ofrecer descuentos'
          onChange={handleDiscountSwitch}
          checked={!!formik.values.monthly.spaceDiscounts}
        />
        <Collapsible isOpen={!!formik.values.monthly.spaceDiscounts}>
          <StyledAllCheckboxWrapper>
            {spaceDiscounts.map(item => {
              const itemIndexInArray =
                formik.values.monthly.spaceDiscounts?.findIndex(_item => _item.spaceDiscountId === item.id) ?? -1;

              return (
                <StyledCheckboxWrapper key={item.id}>
                  <LabeledCheckbox
                    label={item.label}
                    checked={itemIndexInArray !== -1}
                    onChange={() => handleDiscountCheckbox(item, itemIndexInArray !== -1)}
                  />
                  {itemIndexInArray !== -1 && (
                    <>
                      <StyledInput
                        placeholder='5%'
                        name={`monthly.spaceDiscounts[${itemIndexInArray}].percentage`}
                        type='number'
                      />
                      <Label
                        text={`$${handleCalculateDiscount(item, itemIndexInArray)} por mes`}
                        variant='currentColor'
                        lowercase
                      />
                    </>
                  )}
                </StyledCheckboxWrapper>
              );
            })}
          </StyledAllCheckboxWrapper>
        </Collapsible>
      </StyledInnerWrapper>
      <StyledInnerWrapper>
        <Switch
          label='Con depósito'
          onChange={handleDepositSwitch}
          checked={formik.values.monthly.spaceDepositId !== null}
        />
        {formik.values.monthly.spaceDepositId !== null && (
          <StyledAllRadioButtonsWrapper>
            {spaceDeposits.map(item => (
              <RadioButton
                key={item.id}
                label={item.label}
                name='spaceDepositId'
                checked={item.id === formik.values.monthly.spaceDepositId}
                onChange={() => handleDepositRadioButton(item)}
              />
            ))}
          </StyledAllRadioButtonsWrapper>
        )}
      </StyledInnerWrapper>
    </StyledRightSide>
  );
}
