/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import ProgressBar, { ProgressBarProps } from '../ProgressBar';
import * as S from './ProgressBarList.styles';

type ProgressBarListProps = {
  list: ProgressBarProps[];
  type?: 'list' | 'column';
};

const ProgressBarList = ({ list, type = 'list' }: ProgressBarListProps) => {
  const [leftList, rightList] = useMemo(() => {
    if (type === 'list') return [list, []];

    const half = Math.ceil(list.length / 2);
    const firstHalf = list.slice(0, half);
    const secondHalf = list.slice(half);

    return [firstHalf, secondHalf];
  }, [type]);

  return (
    <S.Container>
      <S.ProgressColumn>
        {leftList.map((progress, i) => (
          <S.ProgressItem key={i}>
            <ProgressBar {...{ ...progress }} />
          </S.ProgressItem>
        ))}
      </S.ProgressColumn>
      {!!rightList.length && (
        <>
          <S.Divider />
          <S.ProgressColumn>
            {rightList.map((progress, i) => (
              <S.ProgressItem key={i}>
                <ProgressBar {...{ ...progress }} />
              </S.ProgressItem>
            ))}
          </S.ProgressColumn>
        </>
      )}
    </S.Container>
  );
};

export default ProgressBarList;
