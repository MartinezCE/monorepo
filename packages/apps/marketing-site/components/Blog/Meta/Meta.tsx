import Head from 'next/head';

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Meta: React.FC<MetaProps> = ({ title, description, image }) => (
  <Head>
    <title>{title}</title>
    <meta name='description' content={description} />
    <meta property='og:image' content={image} />
  </Head>
);

export default Meta;
