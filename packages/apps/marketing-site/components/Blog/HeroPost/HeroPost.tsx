import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import styled from 'styled-components';
import { StrapiAuthor } from '../../../interfaces/api';
import { formattedPostDate } from '../../../utils/date';
import CoverImage from '../CoverImage';
import Avatar from '../Avatar';

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes[7]};
  line-height: ${({ theme }) => theme.lineHeights[5]};
  margin-bottom: 1rem;
`;

const StyledDataContainer = styled.div`
  column-gap: 4rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  display: grid;
  color: ${({ theme }) => theme.colors.darkBlue};
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
  }
`;

const StyledDate = styled.p`
  margin-bottom: 1rem;
`;

const StyledLink = styled.a`
  cursor: pointer;
  text-align: center;
  user-select: none;
  color: inherit;
  text-decoration: inherit;
  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

const StyledRightContent = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
`;

const StyledCoverImageWrapper = styled.div`
  margin-bottom: 64px;
`;

type HeroPostProps = {
  coverImage?: string;
  description?: string;
  slug?: string;
  title?: string;
  author?: StrapiAuthor;
  date?: string;
};

const HeroPost: React.FC<HeroPostProps> = ({ title, description, coverImage, date, author, slug }) => (
  <section>
    {coverImage && (
      <StyledCoverImageWrapper>
        <CoverImage title={title} src={coverImage} slug={slug} />
      </StyledCoverImageWrapper>
    )}
    <StyledDataContainer>
      <div>
        <StyledTitle>
          <Link href={`/blog/${slug}`} passHref>
            <StyledLink>{title}</StyledLink>
          </Link>
        </StyledTitle>
        {date && <StyledDate>{format(new Date(date), formattedPostDate, { locale: es })}</StyledDate>}
      </div>
      <StyledRightContent>
        <p>{description}</p>
        <Avatar name={author?.name} picture={author?.picture?.data?.attributes.url} />
      </StyledRightContent>
    </StyledDataContainer>
  </section>
);

export default HeroPost;
