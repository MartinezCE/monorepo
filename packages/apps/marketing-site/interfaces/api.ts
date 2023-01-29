import { ButtonMixinProps } from '../components/mixins';

export interface ReservationCheckIn {
  id: number | string;
  startAt: string;
  status: string;
  user: {
    firstName: string;
    lastName: string;
  };
  seat: {
    name: string;
    blueprint: {
      name: string;
      floor: {
        number: number;
        location: {
          name: string;
        };
      };
    };
  };
}
export interface StrapiData<TAttributes, TMeta = object> {
  id: number;
  attributes: TAttributes;
  meta?: TMeta;
}

export interface DefaultStrapiResponse<TAttributes, TMeta = object> {
  data: StrapiData<TAttributes> | StrapiData<TAttributes, TMeta>[];
}

export type StrapiBlock = BlockMainHero | BlockImageList | BlockFeatureDescription;

export interface StrapiPage {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: 'es-AR' | 'es-MX';
  blocks: StrapiBlock[];
}

export type StrapiPageResponse = StrapiData<StrapiPage>;

interface Component {
  id: number;
  __component: string;
}

export enum ComponentsEnum {
  'BLOCKS_MAIN_HERO' = 'blocks.main-hero',
  'BLOCKS_IMAGE_LIST' = 'blocks.image-list',
  'BLOCKS_FEATURE_DESCRIPTION' = 'blocks.feature-description',
  'BLOCKS_WIZARD_SLIDER' = 'blocks.wizard-slider',
  'BLOCKS_HORIZONTAL_SLIDER' = 'blocks.horizontal-slider',
  'BLOCKS_OFFER_LIST' = 'blocks.offer-list',
  'BLOCKS_TESTIMONIALS' = 'blocks.testimonials',
  'BLOCKS_PRE_FOOTER' = 'blocks.prefooter',
  'BLOCKS_IFRAME' = 'blocks.iframe',
  'BLOCKS_TYPEFORM' = 'blocks.typeform',
  'BLOCKS_SCRIPT' = 'blocks.script',
}

export interface BlockMainHero extends Component {
  __component: ComponentsEnum.BLOCKS_MAIN_HERO;
  title?: string;
  text?: string;
  image?: {
    data?: StrapiImage;
  };
  button?: StrapiButton;
  selectButton?: StrapiSelectButton;
  footerImages?: {
    data?: StrapiImage[];
  };
}

export interface BlockImageList extends Component {
  __component: ComponentsEnum.BLOCKS_IMAGE_LIST;
  cards?: StrapiCard[];
}

export interface BlockFeatureDescription extends Component {
  __component: ComponentsEnum.BLOCKS_FEATURE_DESCRIPTION;
  overlineText?: string;
  title?: string;
  features?: StrapiCard[];
}

export interface BlockWizardSlider extends Component {
  __component: ComponentsEnum.BLOCKS_WIZARD_SLIDER;
  title?: string;
  hideSteps?: boolean;
  views?: {
    id?: number;
    title?: string;
    slides?: StrapiCard[];
  }[];
}

export interface BlockHorizontalSlider extends Component {
  __component: ComponentsEnum.BLOCKS_HORIZONTAL_SLIDER;
  title?: string;
  slides?: StrapiCard[];
}

export interface BlockOfferList extends Component {
  __component: ComponentsEnum.BLOCKS_OFFER_LIST;
  title?: string;
  views?: {
    id?: number;
    title?: string;
    items?: StrapiCard[];
  }[];
}

export interface BlockTestimonials extends Component {
  __component: ComponentsEnum.BLOCKS_TESTIMONIALS;
  testimonails?: {
    id?: number;
    avatar?: { data: StrapiImage };
    companyLogo?: { data: StrapiImage };
    companyName?: string;
    fullName?: string;
    jobPosition?: string;
    quote?: string;
  }[];
}

export interface BlockPreFooter extends Component {
  __component: ComponentsEnum.BLOCKS_PRE_FOOTER;
  button?: StrapiButton;
  description?: string;
  title?: string;
  image?: {
    data: StrapiImage;
  };
}

export interface BlockIFrame extends Component {
  __component: ComponentsEnum.BLOCKS_IFRAME;
  overlineText?: string;
  title?: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface BlockTypeForm extends Component {
  __component: ComponentsEnum.BLOCKS_TYPEFORM;
  overlineText?: string;
  title?: string;
  typeformId?: string;
  width?: number;
  height?: number;
}

export interface StrapiButton {
  id: number;
  link?: string;
  text?: string;
  type?: ButtonMixinProps['variant'];
  openNewTab?: boolean;
}

export interface StrapiSelectButton {
  id?: number;
  placeholder?: string;
  text?: string;
  options?: StrapiButton[];
}

export type StrapiImage = StrapiData<{
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      ext: string;
      url: string;
      hash: string;
      mime: string;
      name: string;
      path: string | null;
      size: number;
      width: number;
      height: number;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export interface StrapiCard {
  id: number;
  title?: string;
  overlineText?: string;
  description?: string;
  button?: StrapiButton;
  image?: {
    data: StrapiImage;
  };
  imageFullWidth?: boolean;
  mobileImage?: {
    data: StrapiImage;
  };
}

export interface Locale {
  locale?: string;
}

export interface DynamicPageProps extends Locale {
  slug: string;
}

export type StrapiAuthor = {
  createdAt: string;
  email?: string | null;
  locale: string;
  name?: string;
  publishedAt: string;
  updatedAt: string;
  picture?: { data?: StrapiImage };
};

export type StrapiArticle = StrapiData<{
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  content: string;
  description: string;
  slug: string;
  title: string;
  author: { data?: StrapiData<StrapiAuthor> };
  image?: { data?: StrapiImage };
}>;
