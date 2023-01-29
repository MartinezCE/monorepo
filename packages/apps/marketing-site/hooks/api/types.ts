import { StrapiImage } from '../../interfaces/api';

export type Link = {
  id: number;
  name: string;
  url: string;
  description: string | null;
};

export type LinkGroup = {
  id: number;
  name: string;
  links: Link[];
};

export type SocialLink = {
  id: number;
  name: string;
  url: string;
  icon: { data: StrapiImage };
};
