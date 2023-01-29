type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (el: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
};

const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;
