/* eslint-disable react/no-danger */

type Props = {
  id: number;
  script: string;
};

const CustomScript = ({ id, script }: Props) => <div id={`${id}`} dangerouslySetInnerHTML={{ __html: script }} />;

export default CustomScript;
