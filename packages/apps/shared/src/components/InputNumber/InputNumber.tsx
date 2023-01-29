import { useFormikContext, getIn } from 'formik';
import { ComponentProps } from 'react';
import styled from 'styled-components';
import Input from '../Input';
import Button from '../Button';
import { images } from '../../assets';

const StyledButtonContainer = styled.div`
  background: ${({ theme }) => theme.colors.extraLightGray};
  border-radius: 4px;
  margin: 6px 0;
  width: 24px;
  margin-right: 10px;
  flex-shrink: 0;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 4px;
    width: calc(100% - 8px);
    height: 1px;
    opacity: 0.3;
    background: ${({ theme }) => theme.colors.gray};
  }
  > button {
    width: 100%;
    height: 50%;
    justify-content: center;
  }
`;

const StyledArrowUp = styled(images.ArrowBottom)`
  transform: rotate(180deg);
`;

type Props = ComponentProps<typeof Input> & {
  onChange?: (value: number) => void;
};

export default function InputNumber({ ...props }: Props) {
  const { setFieldValue, values } = useFormikContext();

  const getValueInRange = (value: number) => {
    if (value < props.min) return Number(props.min);
    if (value > props.max) return Number(props.max);
    return Number(value);
  };

  const handleButtonClick = (newValue: number) => setFieldValue(props.name, getValueInRange(newValue));

  return (
    <Input
      type='number'
      trailingAdornment={
        <StyledButtonContainer>
          <Button variant='transparent' onClick={() => handleButtonClick(Number(getIn(values, props.name)) + 1)}>
            <StyledArrowUp />
          </Button>
          <Button variant='transparent' onClick={() => handleButtonClick(Number(getIn(values, props.name)) - 1)}>
            <images.ArrowBottom />
          </Button>
        </StyledButtonContainer>
      }
      {...props}
    />
  );
}
