import styled from 'styled-components';
import BaseFormHeader from '../BaseFormHeader';
import { images } from '../../../assets';
import Link from '../../Link';
import Button from '../../Button';
import { ButtonIconMixin } from '../../../common/mixins';

const StyledButtonIcon = styled(Button)`
  ${ButtonIconMixin};
`;

const StyledLink = styled(Link)`
  column-gap: 8px;
`;

const StyledWrapper = styled.div`
  display: flex;
`;

const StyledRightButton = styled.button`
  width: 216px;
  height: 46px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  color: #175cff;
  border: 1px solid #175cff;
  border-radius: 4px;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
`;

export default function LayoutHeader({
  primaryText,
  secondaryText,
  onCompleteInfoHref,
  onSendToApprobationClick,
}: {
  primaryText?: string;
  secondaryText?: string;
  onCompleteInfoHref?: string;
  onSendToApprobationClick?: () => void;
}) {
  return (
    <BaseFormHeader primaryText={primaryText} secondaryText={secondaryText}>
      <StyledWrapper>
        <StyledLink href={onCompleteInfoHref} variant='fourth' noBackground>
          <StyledButtonIcon variant='secondary' leadingIcon={<images.TinyEdit />} onClick={() => onCompleteInfoHref} />
        </StyledLink>
      </StyledWrapper>
      <StyledRightButton disabled onClick={onSendToApprobationClick}>
        <images.Download />
        Importar posiciones
      </StyledRightButton>
    </BaseFormHeader>
  );
}
