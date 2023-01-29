/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { ComponentsEnum, StrapiBlock } from '../../interfaces/api';
import FeatureDescription from '../blocks/FeatureDescription';
import HorizontalSlider from '../blocks/HorizontalSlider';
import ImageList from '../blocks/ImageList/ImageList';
import MainHero from '../blocks/MainHero';
import OfferList from '../blocks/OfferList';
import Prefooter from '../blocks/PreFooter';
import Testimonials from '../blocks/Testimonials';
import WizardSlider from '../blocks/WizardSlider';
import IFrame from '../blocks/IFrame';
import TypeForm from '../blocks/TypeForm';
import CustomScript from '../blocks/CustomScript';

type Props = StrapiBlock;

const blocks = {
  [ComponentsEnum.BLOCKS_MAIN_HERO]: MainHero,
  [ComponentsEnum.BLOCKS_IMAGE_LIST]: ImageList,
  [ComponentsEnum.BLOCKS_FEATURE_DESCRIPTION]: FeatureDescription,
  [ComponentsEnum.BLOCKS_WIZARD_SLIDER]: WizardSlider,
  [ComponentsEnum.BLOCKS_HORIZONTAL_SLIDER]: HorizontalSlider,
  [ComponentsEnum.BLOCKS_OFFER_LIST]: OfferList,
  [ComponentsEnum.BLOCKS_TESTIMONIALS]: Testimonials,
  [ComponentsEnum.BLOCKS_PRE_FOOTER]: Prefooter,
  [ComponentsEnum.BLOCKS_IFRAME]: IFrame,
  [ComponentsEnum.BLOCKS_TYPEFORM]: TypeForm,
  [ComponentsEnum.BLOCKS_SCRIPT]: CustomScript,
};

const BlockManager = (props: Props) => {
  const Component = blocks[props.__component as keyof typeof blocks];

  // @ts-ignore
  return Component ? <Component {...props} /> : null;
};

export default BlockManager;
