import React from 'react';
import styled from 'styled-components';
import { FormikProvider, useFormik } from 'formik';
import { InputSpinner } from '@wimet/apps-shared';

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const StyledTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTitle = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const StyledExtraTitle = styled.span`
  color: ${({ theme }) => theme.colors.blue};
  font-size: 16px;
  font-weight: 200;
  line-height: 24px;
  margin-left: 4px;
`;

type Props = {
  title: String;
  suffixText?: String;
};

const FilterInputNumber = ({ title, suffixText }: Props) => {
  const formik = useFormik({ initialValues: { spaceTypeId: 1, sortBy: 1 }, onSubmit: () => {} });
  return (
    <FormikProvider value={formik}>
      <StyledWrapper>
        <StyledTextWrapper>
          <StyledTitle>{title}</StyledTitle>
          {suffixText && <StyledExtraTitle>{suffixText}</StyledExtraTitle>}
        </StyledTextWrapper>
        <InputSpinner min={10} value={11} onChange={() => {}} name='spinner' />
      </StyledWrapper>
    </FormikProvider>
  );
};

export default FilterInputNumber;
