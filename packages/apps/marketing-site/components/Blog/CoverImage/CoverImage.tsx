import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

const StyledLink = styled.a``;

type CoverImageProps = {
  title?: string;
  src?: string;
  slug?: string;
};

const CoverImage: React.FC<CoverImageProps> = ({ title, src, slug }) => {
  const image = src ? <Image width={2000} height={1000} alt={`Cover Image for ${title}`} src={src || ''} /> : null;
  return (
    <div>
      {slug ? (
        <Link href={`/blog/${slug}`} passHref>
          <StyledLink aria-label={title}>{image}</StyledLink>
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
