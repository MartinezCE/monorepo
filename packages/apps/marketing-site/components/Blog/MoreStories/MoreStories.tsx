import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Link from 'next/link';
import styled from 'styled-components';
import CoverImage from '../CoverImage';
import { StrapiArticle } from '../../../interfaces/api';
import { formattedPostDate } from '../../../utils/date';
import Avatar from '../Avatar';

const StyledPostsContainer = styled.div`
  column-gap: 128px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    column-gap: 64px;
  }
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    row-gap: 80px;
  }
`;

const StyledPostTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes[6]};
  line-height: ${({ theme }) => theme.lineHeights[4]};
  margin-bottom: 16px;
  a {
    color: inherit;
    text-decoration: inherit;
    &:hover {
      color: ${({ theme }) => theme.colors.darkBlue};
    }
  }
`;

const StyledMoreTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes[8]};
  line-height: ${({ theme }) => theme.lineHeights[5]};
  font-weight: ${({ theme }) => theme.fontWeight[3]};
  margin-bottom: 45px;

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: ${({ theme }) => theme.fontSizes[7]};
    line-height: ${({ theme }) => theme.lineHeights[5]};
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
    margin-bottom: 30px;
  }
`;

const StyledText = styled.p`
  margin-bottom: 1rem;
`;

const StyledCoverImageWrapper = styled.div`
  margin-bottom: 20px;
`;

const StyledContent = styled.div`
  @media screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 24px;
  }
`;

type PostPreviewProps = {
  posts: StrapiArticle[];
};

const PostsPreview: React.FC<PostPreviewProps> = ({ posts }) => (
  <div>
    <StyledMoreTitle>Más posts</StyledMoreTitle>
    <StyledPostsContainer>
      {posts.map(post => (
        <div key={post.attributes.slug}>
          <StyledCoverImageWrapper>
            {post.attributes.image?.data && (
              <CoverImage
                title={post.attributes.title}
                src={post.attributes.image?.data?.attributes.url}
                slug={post.attributes.slug}
              />
            )}
          </StyledCoverImageWrapper>
          <StyledContent>
            <StyledPostTitle>
              <Link href={`/blog/${post.attributes.slug}`}>{post.attributes.title}</Link>
            </StyledPostTitle>
            {post.attributes.createdAt && (
              <StyledText>{format(new Date(post.attributes.createdAt), formattedPostDate, { locale: es })}</StyledText>
            )}
            <StyledText>{post.attributes.description}</StyledText>
            {post.attributes.author.data && (
              <Avatar
                name={post.attributes.author.data.attributes.name}
                picture={post.attributes.author.data.attributes.picture?.data?.attributes.url}
              />
            )}
          </StyledContent>
        </div>
      ))}
    </StyledPostsContainer>
  </div>
);

export default PostsPreview;
