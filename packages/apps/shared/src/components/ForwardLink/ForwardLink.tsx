import styled from 'styled-components';
import Link from '../Link';
import { ChevronRight } from '../../assets/images';

const StyledLink = styled(Link)`
  width: max-content;
`;

type ForwardLinkProps = {
  showTrailingIcon?: boolean;
  className?: string;
  href: string;
};

const ForwardLink: React.FC<ForwardLinkProps> = ({ children, className, href, showTrailingIcon = true }) => (
  <StyledLink
    className={className}
    variant='fourth'
    trailingIcon={showTrailingIcon && <ChevronRight />}
    noBackground
    href={href}>
    {children || 'Completar información'}
  </StyledLink>
);

export default ForwardLink;
