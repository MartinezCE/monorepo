type Props = {
  id?: string;
};

const InfoWindow: React.FC<Props> = ({ id, children }) => <div id={id}>{children}</div>;

export default InfoWindow;
