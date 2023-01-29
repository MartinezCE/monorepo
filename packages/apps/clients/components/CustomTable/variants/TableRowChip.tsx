import styled from 'styled-components';

const StyleChip = styled.span`
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  align-items: center;
  padding: 4px 10px;
  height: 22px;
  border-radius: 16px;
  &.success {
    color: #21761f;
    background: #cfefe0;
  }
  &.alert {
    color: #002b8f;
    background: #ebf1ff;
  }
  &.danger {
    color: #ff0000;
    background: #ffcccc;
  }
`;

export type ColorsChip = 'success' | 'alert' | 'danger';

type PropChip = {
  variant: ColorsChip | undefined;
  text: string | undefined;
};

const TableRowChip = ({ variant, text }: PropChip) => <StyleChip className={variant}>{text}</StyleChip>;

export default TableRowChip;
