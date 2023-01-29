import { Collapsible, Label, images, Tag, Button, Select } from '@wimet/apps-shared';
import { FormikProvider, useFormik } from 'formik';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { Plan } from '../../../pages/pass/plans/list';

const StyledCardWrapper = styled.div<{ open: boolean; isEnterprise: boolean }>`
  display: grid;
  grid-template-areas:
    ${({ isEnterprise }) => {
      if (isEnterprise) return "'creditSection costSection costSection costSection costSection moreInfoSection'";
      return "'creditSection costSection costSection detailCostSection detailCostSection moreInfoSection'";
    }}
    'detailedInfoSection detailedInfoSection detailedInfoSection detailedInfoSection detailedInfoSection detailedInfoSection';
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 20px 8px 10px 8px;
  border-radius: 5px;
  flex-wrap: wrap;
  cursor: pointer;

  > div:nth-child(1) {
    width: 100px;
    background-color: #f8f8f8;
    grid-area: creditSection;
    padding: ${({ isEnterprise }) => (isEnterprise ? '10px 8px' : '15px 8px')};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    text-align: center;
    > h6 {
      color: ${({ theme }) => theme.colors.blue};
      font-size: ${({ isEnterprise }) => (isEnterprise ? '18px' : '24px')};
    }
  }

  > div:nth-child(2) {
    width: ${({ isEnterprise }) => (isEnterprise ? '400px' : '200px')};
    grid-area: costSection;
    display: flex;
    position: relative;
    align-items: center;
    gap: 20px;

    & > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }

  > div:last-child {
    grid-area: detailedInfoSection;
    margin: ${({ open }) => (open ? '40px 0 20px 0 ' : '0')};
    transition: margin 0.2s ease-in-out, height 0.2s ease-in-out;
  }
`;

const StyledDetailCost = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  grid-area: detailCostSection;
  padding-left: 10px;
  justify-content: center;
  gap: 20px;
  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const StyledMoreInfo = styled.div`
  display: flex;
  width: 80px;
  grid-area: moreInfoSection;
  align-items: center;

  > button > svg {
    color: ${({ theme }) => theme.colors.blue};
  }
`;

const StyledCostTag = styled(Tag)<{ tag: Plan['name'] }>`
  position: absolute;
  top: -35px;
  background-color: ${({ tag }) => {
    switch (tag) {
      case 'pay-as-you-go':
        return 'rgba(220, 231, 255, 1)';
      case 'monthly':
        return 'rgba(255, 128, 48, 1)';
      default:
        return '';
    }
  }};
`;

const StyledPercentageTag = styled(Tag)`
  background-color: rgba(248, 248, 248, 1);
`;

const StyledCostLabel = styled(Label)`
  color: rgba(0, 43, 143, 1);
`;

const StyledDetail = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 20px 0 20px;
  overflow: hidden;

  & > svg {
    width: 60px;
  }
`;

const StyledGrayLabel = styled(Label)`
  color: rgba(44, 48, 56, 1);
`;

const StyledSelect = styled(Select)`
  position: absolute;
  top: -35px;
  background-color: rgba(82, 196, 255, 1);
  border-radius: 4px;
  padding: 4px 4px 4px 4px;

  & > div > div > div > div {
    color: ${({ theme }) => `${theme.colors.black} !important`};
  }
`;

const StyledTinyChevronDown = styled(images.TinyChevronDown)<{ open: boolean }>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

type Props = {
  plan: Plan;
  onClick: () => void;
};

export default function PlanCard({ plan, onClick }: Props) {
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: { team: plan.variations[0].value },
    onSubmit: () => {},
  });

  const variation = useMemo(() => {
    const result = plan.variations.find(item => item.value === formik.values.team);
    return result || plan.variations[0];
  }, [formik.values.team, plan.variations]);

  const handleOnClickMore = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <FormikProvider value={formik}>
      <StyledCardWrapper open={open} isEnterprise={plan.name === 'monthly'} onClick={onClick}>
        <div>
          <h6>{variation.credits}</h6>
          {plan.name !== 'monthly' && <Label text='créditos' lowercase variant='tertiary' />}
        </div>
        <div>
          <div>
            {plan.name && (
              <>
                {plan.variations.length > 1 ? (
                  <StyledSelect options={plan.variations} name='team' instanceId='tagOptions' variant='secondary' />
                ) : (
                  <StyledCostTag tag={plan.name}>{plan.name}</StyledCostTag>
                )}
              </>
            )}
            <StyledCostLabel
              text={variation.monthValue ? `ARS $${variation.monthValue}` : variation.title}
              size='xlarge'
              variant='tertiary'
              lowercase
            />
            {plan.name === 'monthly' ? (
              <StyledGrayLabel text={variation.description} lowercase size='small' />
            ) : (
              <StyledCostLabel text='/ mes' lowercase size='small' variant='tertiary' />
            )}
          </div>
          {plan.percentage && <StyledPercentageTag>{plan.percentage}%</StyledPercentageTag>}
        </div>
        {plan.name !== 'monthly' && (
          <StyledDetailCost>
            <div>
              <images.Money />
              <StyledGrayLabel text={`ARS $${variation.creditValue} / crédito`} lowercase size='small' />
            </div>
            <div>
              <images.Calendar />
              <StyledGrayLabel text={`${variation.visitRange} visitas / mes`} lowercase size='small' />
            </div>
          </StyledDetailCost>
        )}
        <StyledMoreInfo>
          <Button variant='transparent' onClick={handleOnClickMore}>
            <Label text='Más info' lowercase size='small' variant='tertiary' />
            <StyledTinyChevronDown open={open} />
          </Button>
        </StyledMoreInfo>
        <Collapsible isOpen={open}>
          <StyledDetail>
            <images.Info />
            <p>
              El plan <strong>{plan.name}</strong> es recomendado para empresas de más de 50 colaboradores que tendrán
              libertad de utilizar créditos según las reglas de presupuesto que definas. La empresa solo paga a mes
              vencido únicamente por los créditos utilizados el mes anterior.
            </p>
          </StyledDetail>
        </Collapsible>
      </StyledCardWrapper>
    </FormikProvider>
  );
}
