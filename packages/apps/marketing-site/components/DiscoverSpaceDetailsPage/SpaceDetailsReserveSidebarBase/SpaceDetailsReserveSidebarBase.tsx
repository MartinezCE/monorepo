import React, { useState } from 'react';
import {
  Checkbox,
  getSpaceTypeLabel,
  images,
  Link,
  BaseFilterSidebar,
  useGetMe,
  Button,
  Space,
  BreakpointBox,
  ErrorText,
} from '@wimet/apps-shared';
import styled from 'styled-components';
import { ErrorMessage, useFormikContext } from 'formik';

const StyledWrapper = styled.div``;

const StyledBaseFilterSidebar = styled(BaseFilterSidebar)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    padding-top: 100px;
  }
`;

const StyledTitle = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    > div > span {
      font-size: 16px;
    }
  }
`;
const StyledTitleName = styled.span`
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 24px;
  font-weight: 500;
`;
const StyledTitleType = styled.span`
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 24px;
  font-weight: 200;
`;
const StyledLocationWrapper = styled.div`
  margin-top: 18px;
  display: flex;
`;
const StyledLocationIcon = styled(images.Pin)`
  color: ${({ theme }) => theme.colors.orange};
  margin-right: 8px;
  min-width: 20px;
`;
const StyledLocationText = styled.div`
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 16px;
  font-weight: 200;
`;

const StyledCheckbox = styled(Checkbox)`
  border-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.blue};
`;

const StyledTermsAndConditionsWrapper = styled.div`
  display: flex;
  margin-top: 48px;
`;

const StyledTermsAndConditionsText = styled.div`
  margin-top: -4px;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 200;
  line-height: 20px;
`;

const StyledHyperLink = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
`;

const StyledAcceptTermsAndConditionsLink = styled(Link)`
  margin-top: 44px;
  width: 100%;
`;

const StyledReserveWarningText = styled.div`
  margin-top: 24px;
  font-weight: 200;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 20px;
  margin-left: 85px;
  margin-right: 85px;
  text-align: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 24px 0;
  }
`;

const StyledReserveButton = styled(Button)`
  margin-top: 44px;
`;

const StyledMaxCreditsErrorWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export type Reservation = {
  companyName: string;
  spaceStyle: string;
  spaceType: string;
  address: string;
};

type Props = {
  children: React.ReactNode;
  onClickClose: () => void;
  isLoading?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onConfirmReservation: () => void;
  space: Partial<Space>;
  isReservationDisabled?: boolean;
};

const SpaceDetailsReserveSidebarBase = ({
  onClickClose,
  space,
  children,
  onConfirmReservation,
  isLoading,
  isReservationDisabled,
}: Props) => {
  const [isTermsAndConditionsChecked, setIsTermsAndConditionsChecked] = useState(false);
  const { errors, validateForm } = useFormikContext();
  const { data } = useGetMe();

  const handleCheckboxChange = async () => {
    setIsTermsAndConditionsChecked(!isTermsAndConditionsChecked);
    await validateForm();
  };
  return (
    <StyledBaseFilterSidebar title='Reserva' onClickClose={onClickClose}>
      <StyledWrapper>
        <StyledTitle>
          {space?.spaceType && (
            <BreakpointBox initialDisplay='none' breakpoints={{ md: 'flex' }}>
              <StyledTitleType>{getSpaceTypeLabel(space?.spaceType?.value)}</StyledTitleType>
            </BreakpointBox>
          )}
          <StyledTitleName>{space?.location?.name}</StyledTitleName>
          {space?.spaceType && (
            <BreakpointBox initialDisplay='flex' breakpoints={{ md: 'none' }}>
              <StyledTitleType>&nbsp;-&nbsp;{getSpaceTypeLabel(space?.spaceType?.value)}</StyledTitleType>
            </BreakpointBox>
          )}
        </StyledTitle>
        <StyledLocationWrapper>
          <StyledLocationIcon />
          <StyledLocationText>{space?.location?.address}</StyledLocationText>
        </StyledLocationWrapper>
        {children}

        <StyledTermsAndConditionsWrapper>
          <StyledCheckbox onChange={handleCheckboxChange} />
          <StyledTermsAndConditionsText>
            He <StyledHyperLink href='/terms'>leído términos y condiciones </StyledHyperLink> de servicio,&nbsp;
            <StyledHyperLink>pautas de seguridad</StyledHyperLink> de {space?.location?.name}, y acepto cumplir con las
            políticas de uso del espacio de {space?.location?.company.name}.
          </StyledTermsAndConditionsText>
        </StyledTermsAndConditionsWrapper>
        {data ? (
          <StyledReserveButton
            fullWidth
            disabled={
              isReservationDisabled || !isTermsAndConditionsChecked || !!Object.keys(errors).length || isLoading
            }
            onClick={onConfirmReservation}>
            Reserva
          </StyledReserveButton>
        ) : (
          <StyledAcceptTermsAndConditionsLink
            disabled={!isTermsAndConditionsChecked}
            href={`${process.env.NEXT_PUBLIC_LOGIN_URL}`}>
            Registrate
          </StyledAcceptTermsAndConditionsLink>
        )}
        <StyledMaxCreditsErrorWrapper>
          <ErrorMessage
            name='currentReservationCredits'
            render={e => typeof e === 'string' && <ErrorText position='relative'>{e}</ErrorText>}
          />
        </StyledMaxCreditsErrorWrapper>

        <StyledReserveWarningText>
          Tu solicitud de reserva debe ser aprobada o denegada dentro de las 24 horas.
        </StyledReserveWarningText>
      </StyledWrapper>
    </StyledBaseFilterSidebar>
  );
};

export default SpaceDetailsReserveSidebarBase;
