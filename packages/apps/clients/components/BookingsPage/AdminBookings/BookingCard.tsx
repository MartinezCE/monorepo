import Image from 'next/image';
import { Button, images, mixins, pluralize, SpaceFile, SpaceReservation } from '@wimet/apps-shared';
import styled from 'styled-components';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const StyledWrapper = styled.div`
  display: flex;
  background-color: ${({ theme: { colors } }) => colors.white};
  gap: 20px;
  border-radius: 8px;
`;

type ColumnProps = {
  width?: string;
  position?: string;
  padding?: string;
};

const StyledBaseColumn = styled.div<ColumnProps>`
  display: flex;
  width: ${({ width }) => width || '20%'};
  padding: ${({ padding }) => padding || '10px'};
  flex-direction: column;
  position: ${({ position }) => position || 'static'};
  justify-content: center;
  > svg {
    color: ${({ theme: { colors } }) => colors.orange};
    margin-bottom: 10px;
  }
`;

type Colors = {
  [key: string]: string;
};

const StyledImage = styled(Image)`
  border-radius: 8px;
`;

const StyledText = styled.p<{ size?: string; weight?: string; color?: string; margin?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${({ size }) => size || '14px'};
  font-weight: ${({ weight }) => weight || 'regular'};
  color: ${({ color, theme: { colors } }) => (color !== undefined ? (colors as Colors)[color] : colors.black)};
  margin: ${({ margin }) => margin || '0'};
`;

const StyledButton = styled(Button)`
  ${mixins.ButtonIconMixin};
  ${mixins.ButtonIconBinMixin};
`;

const StyledImageDescription = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  position: absolute;
  width: 110px;
  background-color: ${({ theme: { colors } }) => colors.white};
  border-radius: 4px;
  top: 25%;
  right: -20px;
  padding: 5px 0 5px 5px;
  > p {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme: { colors } }) => colors.blue};
  }
  > span {
    font-size: 12px;
  }
`;

export default function BookingCard({ data }: { data: SpaceReservation }) {
  const spaceFiles = data.space.spaceFiles as unknown as SpaceFile[];
  const image = spaceFiles ? spaceFiles[0].url : '/images/placeholder.png';
  return (
    <StyledWrapper>
      <StyledBaseColumn position='relative' width='25%'>
        <StyledImage src={image} width={200} height={130} />
        <StyledImageDescription>
          <p>{data.space.location.name}</p>
          <span>{data.space.name}</span>
        </StyledImageDescription>
      </StyledBaseColumn>
      <StyledBaseColumn width='30%'>
        <images.Calendar />
        <StyledText>Creación: {format(new Date(data.createdAt), 'dd/MM/yyyy')}</StyledText>
        <StyledText weight='bold'>
          Reserva: {formatInTimeZone(data.startDate, data.destinationTz, 'dd/MM/yyyy')}
        </StyledText>
      </StyledBaseColumn>
      <StyledBaseColumn>
        <StyledText color='blue' weight='700'>
          {data.planRenovation.plan?.name}
        </StyledText>
        <StyledText color='orange'>
          <StyledText color='orange' weight='700' margin='2px 0 0 0'>
            {data.usedCredits}
          </StyledText>
          &nbsp;
          {pluralize(data.usedCredits, 'crédito')}
        </StyledText>
      </StyledBaseColumn>
      <StyledBaseColumn width='25%'>
        <images.User />
        <StyledText weight='700'>{`${data.user.firstName} ${data.user.lastName}`}</StyledText>
      </StyledBaseColumn>
      {/* <StyledBaseColumn width='14%'>
        <images.Money />
        <StyledText weight='700'>{coinCode}</StyledText>
      </StyledBaseColumn> */}
      <StyledBaseColumn width='8%' padding='0 20px 0 0'>
        <StyledButton variant='secondary' leadingIcon={<images.TinyBin />} onClick={() => {}} />
      </StyledBaseColumn>
    </StyledWrapper>
  );
}
