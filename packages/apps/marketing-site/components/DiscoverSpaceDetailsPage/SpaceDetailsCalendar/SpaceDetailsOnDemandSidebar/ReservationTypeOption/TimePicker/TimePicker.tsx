import { Collapsible, ErrorText, getError } from '@wimet/apps-shared';
import { set } from 'date-fns';
import { useField } from 'formik';
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';

const StyledReactDatePickerWrapper = styled.div`
  & .react-datepicker__tab-loop {
    visibility: hidden;
  }

  & input {
    padding: 6px 12px 6px 12px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.darkGray};
    font-size: 14px;
    font-weight: 200;
    height: 32px;
    width: 92px;
  }
`;
type Props = {
  name: string;
  moveSiblingOnError?: boolean;
};

const TimePicker = ({ moveSiblingOnError, ...props }: Props) => {
  const [field, meta, helpers] = useField(props?.name);
  const error = meta.touched ? getError(meta.error) : undefined;
  return (
    <StyledReactDatePickerWrapper>
      <ReactDatePicker
        name={field.name}
        selected={field.value}
        onChange={
          (d: Date) =>
            helpers.setValue(
              set(field.value, { hours: d?.getHours(), minutes: d?.getMinutes(), seconds: d?.getSeconds() })
            )
          // eslint-disable-next-line react/jsx-curly-newline
        }
        showTimeSelect={false}
        showTimeSelectOnly
        timeIntervals={60}
        dateFormat='H:mm'
        timeFormat='p'
        onBlur={() => helpers.setTouched(true)}
      />
      {moveSiblingOnError ? (
        <Collapsible isOpen={!!error} deps={[error]}>
          <ErrorText>{error}</ErrorText>
        </Collapsible>
      ) : (
        <ErrorText position='absolute'>{error}</ErrorText>
      )}
    </StyledReactDatePickerWrapper>
  );
};

export default TimePicker;
