import styled from 'styled-components';

const StyleText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #667085;
`;

type PropText = { text: string | undefined };

const TableRowText = ({ text }: PropText) => <StyleText>{text}</StyleText>;
export default TableRowText;
