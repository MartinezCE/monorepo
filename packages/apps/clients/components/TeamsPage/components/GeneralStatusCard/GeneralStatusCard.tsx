import * as S from './GeneralStatusCard.styles';

export enum StatusTypes {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type StatusType = {
  type: StatusTypes;
  percentage: string | number;
  text: string;
};

type GeneralStatusCardProps = {
  title: string;
  info: string;
  status?: StatusType;
};

const GeneralStatusCard = ({ title, info, status }: GeneralStatusCardProps) => (
  <S.GeneralStatusCardWrapper>
    <p className='general-status__title'>{title}</p>
    <div className='general-status__info'>
      <p className='general-status__info--number'>{info}</p>
      {status && (
        <div className='general-status__info__status'>
          <span className={`general-status__info__status--icon ${status.type}`}>↑</span>
          <p className={`general-status__info__status--percentage ${status.type}`}>{status.percentage}%</p>
          <p className='general-status__info__status--text'>{status.text}</p>
        </div>
      )}
    </div>
  </S.GeneralStatusCardWrapper>
);

export default GeneralStatusCard;
