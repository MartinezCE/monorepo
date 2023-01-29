/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import { ReactChild } from 'react';
import styled from 'styled-components';
import TableRowAvatar from './variants/TableRowAvatar';
import TableRowChip, { ColorsChip } from './variants/TableRowChip';
import TableRowText from './variants/TableRowText';

const StyleRow = styled.td`
  padding: 1rem 1.5rem;
`;

export type TypeData = {
  variant: string;
  title?: string;
  subtitle?: string;
  text?: string;
  type?: ColorsChip;
  children?: ReactChild;
};

type PropData = {
  data: TypeData[];
};

export const VariantType = {
  AVATAR: 'avatar',
  CHIP: 'chip',
  TEXT: 'text',
  CUSTOM: 'custom',
};

const CustomTableRow = ({ data }: PropData) => (
  <>
    {data.map((item, i) => (
      <StyleRow key={i}>
        {item.variant === VariantType.AVATAR && <TableRowAvatar title={item.title} subtitle={item.subtitle} />}
        {item.variant === VariantType.CHIP && <TableRowChip text={item.text} variant={item.type} />}
        {item.variant === VariantType.TEXT && <TableRowText text={item.text} />}
        {item.variant === VariantType.CUSTOM && <>{item.children}</>}
      </StyleRow>
    ))}
  </>
);

export default CustomTableRow;
