import { FormikProvider, useFormik } from 'formik';
import styled from 'styled-components';
import { images } from '../../assets';
import Button from '../Button';
import TitleEditable from '../TitleEditable';

const StyledWrapper = styled.div`
  display: flex;
  height: 28px;
  padding: 6px 12px;
  border-radius: 56px;
  background-color: ${({ theme }) => theme.colors.extraLightGray};
`;

const StyledPillText = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[0]};
  font-weight: ${({ theme }) => theme.fontWeight[0]};
  line-height: ${({ theme }) => theme.lineHeights[0]};
`;
const StyledCloseIcon = styled(images.TinyClose)`
  transform: scale(0.9);
  & path {
    stroke-width: 1 !important;
  }
`;

const StyledRemoveButton = styled(Button)`
  margin-left: 10px;
  width: 16px;
  height: 16px;
  border-radius: 32px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const StyledTitleEditable = styled(TitleEditable)`
  > div > div > div > div > input {
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme: { colors } }) => colors.darkGray};
  }
`;

type Props = {
  text: string;
  onClickClose?: () => void;
  className?: string;
  hideRemoveButton?: boolean;
  isEditable?: boolean;
  onEditText?: (values: { text: string }) => void;
};

const Pill = ({ text, onClickClose, className, hideRemoveButton, isEditable, onEditText }: Props) => {
  const formik = useFormik({
    initialValues: { text },
    onSubmit: onEditText,
  });
  return (
    <FormikProvider value={formik}>
      <StyledWrapper className={className}>
        {isEditable ? (
          <StyledTitleEditable names={['text']} onSave={() => formik.handleSubmit()} />
        ) : (
          <StyledPillText>{text}</StyledPillText>
        )}
        {!hideRemoveButton && (
          <StyledRemoveButton variant='transparent' onClick={onClickClose}>
            <StyledCloseIcon />
          </StyledRemoveButton>
        )}
      </StyledWrapper>
    </FormikProvider>
  );
};

export default Pill;
