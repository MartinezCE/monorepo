import React from 'react';
import { BlockImageList } from '../../../interfaces/api';
import ImageListDesktop from '../../Homepage/ImageListDesktop';
import ImageListMobile from '../../Homepage/ImageListMobile';

type Props = BlockImageList;

const ImageList = (props: Props) => (
  <>
    <ImageListDesktop {...props} />
    <ImageListMobile {...props} />
  </>
);

export default ImageList;
