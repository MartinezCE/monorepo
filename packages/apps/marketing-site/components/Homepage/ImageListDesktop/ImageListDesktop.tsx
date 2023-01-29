import Image from 'next/image';
import styled from 'styled-components';
import { BreakpointBox } from '@wimet/apps-shared';
import SolutionSlide from './ImageListSlide';
import { BlockImageList } from '../../../interfaces/api';
import { getImageProps } from '../../../utils/images';

const StyledWrapper = styled(BreakpointBox)`
  overflow-x: hidden;
`;

const StyledImageContainer = styled.div`
  width: 100%;
  position: relative;
`;

type Props = BlockImageList;

export default function ImageListDesktop({ cards }: Props) {
  return (
    <StyledWrapper initialDisplay='block' breakpoints={{ md: 'none' }}>
      {cards?.map(({ id, overlineText, title, description, button, image }, i) => (
        <SolutionSlide
          key={id}
          id={overlineText || ''}
          label={overlineText || ''}
          title={title || ''}
          description={description || ''}
          buttonText={button?.text || ''}
          href={button?.link || '#'}
          target={button?.openNewTab ? '_blank' : '_self'}
          rtl={!(i % 2)}
          firstItem={i === 0}>
          <StyledImageContainer>
            <Image {...getImageProps(image)} objectFit='contain' />
          </StyledImageContainer>
        </SolutionSlide>
      ))}
    </StyledWrapper>
  );
}
