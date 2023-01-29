import styled from 'styled-components';
import { images } from '../../assets';
import Link from '../Link';

const StyledLink = styled(Link)`
  display: flex;
  width: max-content;
  color: ${({ theme }) => theme.colors.orange};
  column-gap: 6px;
  padding-right: 5px;
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    background: ${({ theme }) => theme.colors.orangeOpacity25};
  }
`;

type BackLinkProps = {
  className?: string;
  href: string;
};

const BackLink: React.FC<BackLinkProps> = ({ children, className, href }) => (
  <StyledLink href={href} leadingIcon={<images.ChevronLeft />} noBackground={true} className={className}>
    {children}
  </StyledLink>
);

export default BackLink;
