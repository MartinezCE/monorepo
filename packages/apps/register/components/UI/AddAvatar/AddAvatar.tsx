import { images, Button } from '@wimet/apps-shared';
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';

type StyledLinkAvatarColor = 'client' | 'member';

const config: { [k in StyledLinkAvatarColor]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {
  client: css`
    border: ${({ theme }) => theme.colors.blue} solid 3px;
  `,
  member: css`
    border: ${({ theme }) => theme.colors.sky} solid 3px;
  `,
};

const StyledLinkAvatar = styled(Button)<{ color: StyledLinkAvatarColor }>`
  position: relative;
  border-radius: 999px;
  width: 72px;
  height: 72px;

  ${({ color }) => config[color]};
`;

const StyledAddButtonWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 100%;
  top: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(220, 231, 255, 1);
  border-radius: 20px;
  transform: translate(-68%, -100%);
`;

const StyledUser = styled(images.User)`
  color: ${({ theme }) => theme.colors.gray};
`;

const StyledMore = styled(images.TinyMore)`
  color: ${({ theme }) => theme.colors.blue};
`;

type Props = {
  color: StyledLinkAvatarColor;
};

const AddAvatar = ({ color }: Props) => (
  <StyledLinkAvatar variant='transparent' color={color}>
    <StyledUser />
    <StyledAddButtonWrapper>
      <StyledMore />
    </StyledAddButtonWrapper>
  </StyledLinkAvatar>
);

export default AddAvatar;
