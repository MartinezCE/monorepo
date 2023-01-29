import { Link } from '@wimet/apps-shared';
import styled, { css } from 'styled-components';
import ConditionalWrapper from './ConditionalWrapper';

export type CustomTab = {
  title: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
};

const TabsWrapper = styled.nav`
  display: flex;
  width: 100%;
  border-bottom: solid 1px ${({ theme }) => theme.colors.lightGray};
`;

const Tab = styled.div<{ active: boolean }>`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1em;
  font-weight: 300;
  padding: 1.3em;
  border-radius: initial;
  border-bottom: solid 3px transparent;
  transition: all 0.2s ease-in;
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      border-bottom: solid 3px ${({ theme }) => theme.colors.blue};
      color: ${({ theme }) => theme.colors.semiDarkGray};
    `};
`;

const LinkTab = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.gray};
`;

const CustomTabs = ({ tabs }: { tabs: CustomTab[] }) => (
  <TabsWrapper>
    {tabs.map(t => (
      <ConditionalWrapper
        key={t.title}
        condition={Boolean(t.href)}
        wrapper={el => (
          <LinkTab variant='transparent' href={t.href}>
            {el}
          </LinkTab>
        )}>
        <Tab active={t.isActive} onClick={t?.onClick}>
          {t.title}
        </Tab>
      </ConditionalWrapper>
    ))}
  </TabsWrapper>
);

export default CustomTabs;
