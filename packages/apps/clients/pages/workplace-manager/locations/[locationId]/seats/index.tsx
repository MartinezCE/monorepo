/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, images, Link, LoadingSpinner } from '@wimet/apps-shared';
import Layout from '../../../../../components/Layout';
import FileUploader, { FileUploaderWrapper } from '../../../../../components/FileUploader';
import CustomTable from '../../../../../components/CustomTable';
import GoBackTitle from '../../../../../components/GoBackTitle';
import LayoutWrapper from '../../../../../components/LayoutWrapper';
import useCreateLocationSeatsBulk, { CsvParsedData } from '../../../../../hooks/useCreateLocationSeatsBulk';
import { TypeData } from '../../../../../components/CustomTable/CustomTableRow';

const CSV_DELIMITER = 'END_OF_FILE';
const TABLE_HEADERS = ['Nombre del plano', 'Posición', 'Tipo', 'Habilitado'];

type FlexColumnProps = {
  gap?: number;
};

const FlexColumn = styled.div<FlexColumnProps>`
  display: flex;
  flex-direction: column;
  row-gap: ${({ gap }) => (gap ? `${gap}px` : '0px')};
  justify-content: flex-start;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.blue};
  font-weight: 300;
`;

const StyledButton = styled(Button)`
  width: fit-content;
  margin-left: auto;
`;

const LocationSeatsPage = () => {
  const [csvFile, setCsvFile] = useState<File[]>();
  const [data, setData] = useState<TypeData[][]>([]);
  const router = useRouter();

  const { locationId } = router.query;

  const { mutateAsync: createBulk, isLoading: sendingBulk } = useCreateLocationSeatsBulk(locationId as string);

  const csvToArray = useCallback((str: string) => {
    const [, ...rows] = str.slice(str.indexOf(CSV_DELIMITER) + CSV_DELIMITER.length).split('\r\n');
    const arr = rows.map(r => r.split(','));
    return arr;
  }, []);

  const parsedSeatsForTable = useCallback(
    (items: string[][]) => items?.map(item => item.map(i => ({ variant: 'text', text: i }))) as unknown as TypeData[][],
    []
  );

  const handleGoBack = () => router.back();

  const getSeatTypeIdByName = (name: string) => {
    const lowerCaseName = name.toLocaleLowerCase();

    if (lowerCaseName.includes('escritorio')) return 1;
    if (lowerCaseName.includes('sala')) return 2;
    if (lowerCaseName.includes('oficina')) return 3;
  };

  const parseCsvData = (csvData: TypeData[][]) => {
    const parsed = csvData?.reduce((acc, item) => {
      const [floorName, seatName, seatType, isAvailable] = item.map(i => i.text || '-');

      const addItem = {
        name: seatName,
        spaceTypeId: getSeatTypeIdByName(seatType) as number,
        isAvailable: isAvailable !== 'No',
      };

      if (!acc?.[floorName]) {
        acc[floorName] = [addItem];
        return acc;
      }

      acc[floorName] = [...acc[floorName], addItem];
      return acc;
    }, {} as CsvParsedData);

    return parsed;
  };

  const handleCreateBulk = async () => {
    const parsedSeats = await parseCsvData(data);
    await createBulk({
      locationId: Number(locationId),
      items: parsedSeats,
    });

    handleGoBack();
  };

  useMemo(() => {
    if (!csvFile?.length) {
      setData([]);
      return;
    }

    const file = csvFile[0];
    const reader = new FileReader();

    reader.onload = e => {
      const text = (e?.target?.result || '') as string;
      const arr = csvToArray(text);
      const seats = parsedSeatsForTable(arr);
      setData(seats);
    };

    reader.readAsText(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvFile]);

  return (
    <Layout>
      <LayoutWrapper>
        <HeaderWrapper>
          <GoBackTitle title='Importa posiciones' onClick={handleGoBack} />
          {!!data.length && (
            <StyledButton className='import-seats-button' onClick={handleCreateBulk} disabled={sendingBulk}>
              {sendingBulk && <LoadingSpinner />}
              Importar {data.length} posiciones
            </StyledButton>
          )}
        </HeaderWrapper>
        <FileUploaderWrapper>
          <FileUploader onChangeFiles={setCsvFile} useCase='bulk-seats'>
            <FlexColumn gap={30}>
              <FlexColumn>
                <span className='dropzone-info-plus-icon'>
                  <images.TinyMore />
                </span>
                <div>
                  <p className='dropzone-info-text'>Arrastra el archivo .csv ó</p>
                  <p className='dropzone-info-link'>haz click para seleccionar un archivo desde tu computadora</p>
                </div>
              </FlexColumn>
              <div>
                <span className='dropzone-info-text'>Recuerda trabajar sobre la planilla de base: </span>
                <StyledLink
                  onClick={e => e.stopPropagation()}
                  href='/assets/bulk-seats-creation.xlsx'
                  variant='transparent'
                  noBackground
                  download>
                  Descargar planilla
                </StyledLink>
              </div>
            </FlexColumn>
          </FileUploader>
        </FileUploaderWrapper>

        {!!data.length && <CustomTable headers={TABLE_HEADERS} data={data} />}
      </LayoutWrapper>
    </Layout>
  );
};

export default LocationSeatsPage;
