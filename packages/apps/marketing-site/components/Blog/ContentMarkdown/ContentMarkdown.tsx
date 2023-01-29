import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import styled from 'styled-components';

const StyledMarkdownWrapper = styled.div`
  p {
    margin: 24px 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 24px 0 16px;
  }
  h1 {
    font-size: ${({ theme }) => theme.fontSizes[6]};
    line-height: ${({ theme }) => theme.lineHeights[4]};
  }
  h2 {
    font-size: ${({ theme }) => theme.fontSizes[5]};
    line-height: ${({ theme }) => theme.lineHeights[3]};
  }
  h3,
  h4,
  h5,
  h6 {
    font-size: ${({ theme }) => theme.fontSizes[4]};
    line-height: ${({ theme }) => theme.lineHeights[3]};
  }
  ol {
    list-style: decimal;
    margin: 16px;
    margin-left: 18px;
  }
  ul {
    margin: 16px 0;
    margin-left: 14px;
    list-style: disc;
  }
  blockquote {
    max-width: 550px;
    padding-left: 20px;
    border-left: 5px solid ${({ theme }) => theme.colors.lightGray};
  }
`;

const StyledImageWrapper = styled.span`
  width: 100%;
  height: 100%;
`;

type ContentMarkdownProps = {
  content: string;
};

const ContentMarkdown: React.FC<ContentMarkdownProps> = ({ content }) => (
  <StyledMarkdownWrapper>
    <ReactMarkdown
      components={{
        img: props => (
          <StyledImageWrapper>
            <Image src={props.src || ''} width='100%' height='100%' layout='responsive' objectFit='cover' />
          </StyledImageWrapper>
        ),
      }}>
      {content}
    </ReactMarkdown>
  </StyledMarkdownWrapper>
);

export default ContentMarkdown;
