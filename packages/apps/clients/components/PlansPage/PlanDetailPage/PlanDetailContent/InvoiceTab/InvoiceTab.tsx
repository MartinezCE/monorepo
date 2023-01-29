import React from 'react';
import styled from 'styled-components';
import useGetPlanRenovations from '../../../../../hooks/api/useGetPlanRenovations';
import NoData from '../NoData';
import InvoicesTable from './InvoicesTable';

const StyledWrapper = styled.div`
  margin-top: 56px;
`;

type Props = {
  planId: number;
};

const InvoiceTab = ({ planId }: Props) => {
  const { data = [] } = useGetPlanRenovations(planId);

  return (
    <>
      {!data.length ? (
        <StyledWrapper>
          <NoData title='Aún no hay facturas emitidas' />
        </StyledWrapper>
      ) : (
        <StyledWrapper>
          {/* <InvoiceTabHeader plan={PLANS[0]} /> */}
          <InvoicesTable renovations={data} />
        </StyledWrapper>
      )}
    </>
  );
};

export default InvoiceTab;
